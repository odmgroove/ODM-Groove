import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET — public (used by AIChatWidget)
export async function GET() {
  const rules = await prisma.aiKnowledge.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(rules);
}

// POST — admin: create a new rule
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { keywords, response, order, question } = body;

  if (!keywords?.trim() || !response?.trim()) {
    return NextResponse.json({ error: "Keywords and response are required." }, { status: 400 });
  }

  const rule = await prisma.aiKnowledge.create({
    data: { 
      question: question?.trim() || null,
      keywords: keywords.trim(), 
      response: response.trim(), 
      order: order ?? 0 
    },
  });

  return NextResponse.json(rule, { status: 201 });
}
