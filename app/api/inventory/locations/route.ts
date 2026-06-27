import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET — list store locations
export async function GET() {
  const locations = await prisma.storeLocation.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { stocks: true } } },
  });
  return NextResponse.json(locations);
}

// POST — create a new store location
export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Location name is required." }, { status: 400 });
    }
    const location = await prisma.storeLocation.create({
      data: { name: name.trim(), description: description?.trim() || null },
    });
    return NextResponse.json(location, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "A location with this name already exists." }, { status: 409 });
    }
    console.error("Location creation error:", e);
    return NextResponse.json({ error: "Failed to create location." }, { status: 500 });
  }
}
