import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { id: _id, createdAt: _c, updatedAt: _u, ...data } = body;
    const room = await prisma.room.update({ where: { id }, data });
    return NextResponse.json(room);
  } catch (err) {
    console.error("PUT /api/rooms/[id] error:", err);
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
