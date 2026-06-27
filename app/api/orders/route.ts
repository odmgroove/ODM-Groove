import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET — list all orders (admin/staff use)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");
  const date = searchParams.get("date"); // ISO date string e.g. "2026-06-27"
  const status = searchParams.get("status");
  const source = searchParams.get("source");

  // Build date range filter
  let dateFilter = {};
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    dateFilter = { createdAt: { gte: start, lte: end } };
  }

  const orders = await prisma.foodOrder.findMany({
    where: {
      ...(department ? { department } : {}),
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
      ...dateFilter,
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" }, // Oldest first — first come, first served
  });

  return NextResponse.json(orders);
}

// POST — create a new order (from website or POS)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    customerName,
    type,
    department,
    location,
    message,
    items,
    totalRevenue,
    totalCost,
    profit,
    payment,
    source,
    createdById,
    shiftId,
  } = body;

  if (!customerName || !department || !items) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Generate short unique ref
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const ref = `ODM-${code}`;

  const order = await prisma.foodOrder.create({
    data: {
      ref,
      customerName: customerName.trim(),
      type: type || "website",
      department,
      location: location?.trim() || null,
      message: message?.trim() || null,
      items: typeof items === "string" ? items : JSON.stringify(items),
      totalRevenue: totalRevenue || 0,
      totalCost: totalCost || 0,
      profit: profit || 0,
      payment: payment || "unpaid",
      source: source || "website",
      createdById: createdById || null,
      shiftId: shiftId || null,
    },
  });

  return NextResponse.json(order, { status: 201 });
}
