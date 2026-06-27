import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (!post || !post.published) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}
