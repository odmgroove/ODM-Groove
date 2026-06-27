import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const admin = await prisma.adminUser.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }, // still valid
      },
    });

    if (!admin) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
