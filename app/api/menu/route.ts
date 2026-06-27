import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/menu?category=food
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  try {
    const items = await prisma.menuItem.findMany({
      where: category ? { category } : {},
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}

// POST /api/menu
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.menuItem.create({ data: body });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
