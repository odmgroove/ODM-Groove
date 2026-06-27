import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

// POST — verify admin password then reset (delete all) inventory transfer logs
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Find the admin user
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect password. Log reset cancelled." }, { status: 401 });
    }

    // Password correct — delete all transfer logs
    const { count } = await prisma.inventoryTransfer.deleteMany({});

    return NextResponse.json({ success: true, deletedCount: count });
  } catch (e) {
    return NextResponse.json({ error: "An error occurred while resetting the log." }, { status: 500 });
  }
}
