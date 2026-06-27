import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET — list all inventory items with optional category filter
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const items = await prisma.inventoryItem.findMany({
    where: category ? { category } : {},
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(items);
}

// POST — create a new inventory item
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name, sku, category, unit, costPrice, sellingPrice,
    mainStoreCount, frontStoreCount, lowStockAlert, linkedMenuItemId,
  } = body;

  if (!name?.trim() || !category?.trim()) {
    return NextResponse.json({ error: "Name and category are required." }, { status: 400 });
  }

  const item = await prisma.inventoryItem.create({
    data: {
      name: name.trim(),
      sku: sku?.trim() || null,
      category: category.trim(),
      unit: unit || "pcs",
      costPrice: costPrice || 0,
      sellingPrice: sellingPrice || 0,
      mainStoreCount: mainStoreCount || 0,
      frontStoreCount: frontStoreCount || 0,
      lowStockAlert: lowStockAlert || 5,
      linkedMenuItemId: linkedMenuItemId || null,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
