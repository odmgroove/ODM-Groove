import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    const sub = await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return NextResponse.json(sub, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
