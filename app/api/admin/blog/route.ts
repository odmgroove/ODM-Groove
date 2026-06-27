import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAdminSession } from "@/app/lib/session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    // basic slug generation if not provided
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const post = await prisma.blogPost.create({ data: { ...body, slug } });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/blog error:", err);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
