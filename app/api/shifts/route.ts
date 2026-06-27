import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET — list shifts (optionally for a specific staff member)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get("staffId");
  const open = searchParams.get("open"); // "true" to get only open shifts

  const shifts = await prisma.shift.findMany({
    where: {
      ...(staffId ? { staffId } : {}),
      ...(open === "true" ? { endTime: null } : {}),
    },
    include: {
      orders: { select: { id: true, totalRevenue: true, totalCost: true, profit: true, payment: true, status: true } },
    },
    orderBy: { startTime: "desc" },
  });

  return NextResponse.json(shifts);
}

// POST — open a new shift
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { staffId, staffName, department } = body;

  if (!staffId) {
    return NextResponse.json({ error: "staffId is required." }, { status: 400 });
  }

  // Check for already-open shift
  const openShift = await prisma.shift.findFirst({
    where: { staffId, endTime: null },
  });
  if (openShift) {
    return NextResponse.json({ error: "You already have an open shift.", shift: openShift }, { status: 409 });
  }

  const shift = await prisma.shift.create({
    data: { staffId, staffName: staffName || null, department: department || null },
  });

  return NextResponse.json(shift, { status: 201 });
}

// PUT — close a shift and compute totals
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { shiftId } = body;

  if (!shiftId) return NextResponse.json({ error: "shiftId is required." }, { status: 400 });

  // Aggregate payment totals for completed orders in this shift
  const orders = await prisma.foodOrder.findMany({
    where: { shiftId, status: "completed" },
  });

  const cashTotal = orders.filter(o => o.payment === "cash").reduce((s, o) => s + o.totalRevenue, 0);
  const posTotal = orders.filter(o => o.payment === "pos").reduce((s, o) => s + o.totalRevenue, 0);
  const transferTotal = orders.filter(o => o.payment === "transfer").reduce((s, o) => s + o.totalRevenue, 0);

  const shift = await prisma.shift.update({
    where: { id: shiftId },
    data: { endTime: new Date(), cashTotal, posTotal, transferTotal },
    include: { orders: true },
  });

  return NextResponse.json(shift);
}
