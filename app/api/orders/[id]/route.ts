import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// PUT — update order status or payment
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { status, payment, items, totalRevenue, totalCost, profit, shiftId } = body;

  const order = await prisma.foodOrder.update({
    where: { id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(payment !== undefined ? { payment } : {}),
      ...(items !== undefined ? { items: typeof items === "string" ? items : JSON.stringify(items) } : {}),
      ...(totalRevenue !== undefined ? { totalRevenue } : {}),
      ...(totalCost !== undefined ? { totalCost } : {}),
      ...(profit !== undefined ? { profit } : {}),
      ...(shiftId !== undefined ? { shiftId } : {}),
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(order);
}

// DELETE — remove an order (admin only)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.foodOrder.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
