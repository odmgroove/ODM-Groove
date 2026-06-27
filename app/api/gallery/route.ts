import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const image = await prisma.galleryImage.create({ data: body });
    return NextResponse.json(image, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 });
  }
}
