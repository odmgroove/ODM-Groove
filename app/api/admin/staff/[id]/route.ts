import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/app/lib/session";

// PUT — update staff name, email, permissions
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  const body = await req.json();
  const { name, email, permissions } = body;

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (existing?.email === "hatykuxordik@gmail.com" && session?.email !== "hatykuxordik@gmail.com") {
    return NextResponse.json({ error: "Unauthorized to modify this account." }, { status: 403 });
  }

  const user = await prisma.adminUser.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name?.trim() || null } : {}),
      ...(email !== undefined ? { email: email.trim().toLowerCase() } : {}),
      ...(permissions !== undefined ? { permissions: JSON.stringify(permissions) } : {}),
    },
    select: {
      id: true, name: true, email: true, isSuperAdmin: true, permissions: true, createdAt: true,
    },
  });

  return NextResponse.json(user);
}

// DELETE — remove a staff account
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  const existing = await prisma.adminUser.findUnique({ where: { id } });
  
  if (existing?.email === "hatykuxordik@gmail.com" && session?.email !== "hatykuxordik@gmail.com") {
    return NextResponse.json({ error: "Unauthorized to delete this account." }, { status: 403 });
  }
  if (existing?.email === "hatykuxordik@gmail.com" && session?.email === "hatykuxordik@gmail.com") {
     return NextResponse.json({ error: "You cannot delete your own super admin account." }, { status: 403 });
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// PATCH — force-reset a user's password (admin-initiated)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  const body = await req.json();
  const { action, newPassword } = body;

  if (action !== "force-reset") {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (existing?.email === "hatykuxordik@gmail.com" && session?.email !== "hatykuxordik@gmail.com") {
    return NextResponse.json({ error: "Unauthorized to reset this password." }, { status: 403 });
  }

  const tempPassword = newPassword?.trim() || "password123";
  const hashed = await bcrypt.hash(tempPassword, 12);

  await prisma.adminUser.update({
    where: { id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  });

  return NextResponse.json({ success: true, tempPassword });
}
