import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/app/lib/session";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const admin = await prisma.adminUser.findFirst();
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.adminUser.update({ where: { id: admin.id }, data: { password: hashed } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
