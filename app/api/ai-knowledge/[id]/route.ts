import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// PUT — admin: update a rule
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { keywords, response, order, question } = body;

  if (!keywords?.trim() || !response?.trim()) {
    return NextResponse.json({ error: "Keywords and response are required." }, { status: 400 });
  }

  const rule = await prisma.aiKnowledge.update({
    where: { id },
    data: { 
      question: question?.trim() || null,
      keywords: keywords.trim(), 
      response: response.trim(), 
      order: order ?? 0 
    },
  });

  return NextResponse.json(rule);
}

// DELETE — admin: delete a rule
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.aiKnowledge.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
