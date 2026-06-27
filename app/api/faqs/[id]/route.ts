import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { id: _id, createdAt: _c, updatedAt: _u, ...data } = body;
    const faq = await prisma.fAQ.update({ where: { id }, data });
    return NextResponse.json(faq);
  } catch (err) {
    console.error("PUT /api/faqs/[id] error:", err);
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.fAQ.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
