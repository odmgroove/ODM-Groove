import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

// Server-side upload: avoids CORS issues when running locally.
// The browser sends the file to this Next.js API route, which then
// forwards it to Vercel Blob server-to-server.
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
