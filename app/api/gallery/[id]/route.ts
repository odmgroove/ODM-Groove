import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const image = await prisma.galleryImage.update({ where: { id }, data: body });
    return NextResponse.json(image);
  } catch {
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the image first to check the URL
    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from Database
    await prisma.galleryImage.delete({ where: { id } });
    
    // Delete from Vercel Blob if it's hosted there
    if (image.url.includes("blob.vercel-storage.com")) {
      const { del } = await import("@vercel/blob");
      await del(image.url);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 });
  }
}
