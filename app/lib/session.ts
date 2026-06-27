import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const COOKIE_NAME = "admin_session";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 24 * 60 * 60, // 1 day
};

export function createAdminSessionCookie(response: NextResponse, userId: string) {
  response.cookies.set(COOKIE_NAME, userId, COOKIE_OPTIONS);
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.delete(COOKIE_NAME);
}

// Fetch full user session from database using the ID in the cookie
export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(COOKIE_NAME)?.value;
    if (!userId) return null;

    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, isSuperAdmin: true, permissions: true }
    });
    
    return user;
  } catch {
    return null;
  }
}

export async function setAdminSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, COOKIE_OPTIONS);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
