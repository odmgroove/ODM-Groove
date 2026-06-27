import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/events — returns events, supports ?status=upcoming|past|all
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "all";

  try {
    const where =
      status === "upcoming"
        ? { date: { gt: new Date() } }
        : status === "past"
        ? { date: { lte: new Date() } }
        : {};

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/events — create a new event (admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = await prisma.event.create({ data: body });
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
