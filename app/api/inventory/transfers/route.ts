import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET — list all transfer/stock log entries with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemId      = searchParams.get("itemId");
  const direction   = searchParams.get("direction"); // e.g. "store_to_front" | "all"
  const locationId  = searchParams.get("locationId"); // filter by target location
  const from        = searchParams.get("from"); // ISO datetime string
  const to          = searchParams.get("to");   // ISO datetime string

  const where: Record<string, unknown> = {};
  if (itemId) where.itemId = itemId;
  if (direction && direction !== "all") where.direction = direction;
  if (locationId && locationId !== "all") where.toLocationId = locationId;
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to   ? { lte: new Date(to) }   : {}),
    };
  }

  const transfers = await prisma.inventoryTransfer.findMany({
    where,
    include: {
      item: { select: { id: true, name: true, unit: true, category: true } },
      transferredBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return NextResponse.json(transfers);
}

// POST — create a transfer (store → front, front → store, adjustment, receive, location_transfer)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { itemId, quantity, direction, note, userId, toLocationId, fromLocationId } = body;

  if (!itemId || !quantity || !direction || !userId) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
  if (!item) return NextResponse.json({ error: "Item not found." }, { status: 404 });

  let mainDelta = 0;
  let frontDelta = 0;

  if (direction === "store_to_front") {
    // Generic front store transfer — no specific location
    if (item.mainStoreCount < quantity) {
      return NextResponse.json({ error: `Not enough stock in Main Store. Available: ${item.mainStoreCount} ${item.unit}.` }, { status: 400 });
    }
    mainDelta  = -quantity;
    frontDelta = +quantity;
  } else if (direction === "location_transfer") {
    // Transfer from main store to a specific named location (VIP, Rooftop, etc.)
    if (item.mainStoreCount < quantity) {
      return NextResponse.json({ error: `Not enough stock in Main Store. Available: ${item.mainStoreCount} ${item.unit}.` }, { status: 400 });
    }
    if (!toLocationId) {
      return NextResponse.json({ error: "A target location is required for location transfers." }, { status: 400 });
    }
    mainDelta  = -quantity;
    frontDelta = +quantity; // still tracked in frontStoreCount as aggregate

    // Upsert location-specific stock
    await prisma.itemLocationStock.upsert({
      where: { inventoryItemId_locationId: { inventoryItemId: itemId, locationId: toLocationId } },
      update: { quantity: { increment: quantity } },
      create: { inventoryItemId: itemId, locationId: toLocationId, quantity },
    });
  } else if (direction === "front_to_store") {
    if (item.frontStoreCount < quantity) {
      return NextResponse.json({ error: `Not enough stock at Front. Available: ${item.frontStoreCount} ${item.unit}.` }, { status: 400 });
    }
    mainDelta  = +quantity;
    frontDelta = -quantity;

    // If returning from a specific location, deduct from that location's stock too
    if (fromLocationId) {
      await prisma.itemLocationStock.upsert({
        where: { inventoryItemId_locationId: { inventoryItemId: itemId, locationId: fromLocationId } },
        update: { quantity: { decrement: quantity } },
        create: { inventoryItemId: itemId, locationId: fromLocationId, quantity: 0 },
      });
    }
  } else if (direction === "receive") {
    // New supplier delivery — adds to main store
    mainDelta = +quantity;
  } else if (direction === "adjustment") {
    // Manual correction — can be positive or negative, affects main store
    mainDelta = quantity;
  }

  // Run stock update + log as a transaction
  const [transfer] = await prisma.$transaction([
    prisma.inventoryTransfer.create({
      data: {
        itemId,
        quantity,
        direction,
        note: note?.trim() || null,
        userId,
        toLocationId:   toLocationId   || null,
        fromLocationId: fromLocationId || null,
      },
    }),
    prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        mainStoreCount:  { increment: mainDelta },
        frontStoreCount: { increment: frontDelta },
      },
    }),
  ]);

  return NextResponse.json(transfer, { status: 201 });
}
