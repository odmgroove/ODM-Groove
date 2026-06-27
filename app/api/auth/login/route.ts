import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { setAdminSession, createAdminSessionCookie } from "@/app/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const response = NextResponse.json({ success: true });
    createAdminSessionCookie(response, admin.id);
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
