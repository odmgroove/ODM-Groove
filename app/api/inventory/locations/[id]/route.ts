import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, description, isActive } = await req.json();
    
    if (!name?.trim()) {
      return NextResponse.json({ error: "Location name is required." }, { status: 400 });
    }

    const location = await prisma.storeLocation.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });
    
    return NextResponse.json(location);
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "A location with this name already exists." }, { status: 409 });
    }
    console.error("Location update error:", e);
    return NextResponse.json({ error: "Failed to update location." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Check if the location is in use
    const location = await prisma.storeLocation.findUnique({
      where: { id },
      include: {
        _count: {
          select: { stocks: true }
        }
      }
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found." }, { status: 404 });
    }

    if (location._count.stocks > 0) {
      return NextResponse.json({ error: "Cannot delete location because it has stock associated with it. You can mark it as inactive instead." }, { status: 400 });
    }

    await prisma.storeLocation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Location delete error:", e);
    return NextResponse.json({ error: "Failed to delete location." }, { status: 500 });
  }
}
