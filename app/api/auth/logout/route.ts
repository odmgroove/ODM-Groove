import { NextResponse } from "next/server";
import { clearAdminSession, clearAdminSessionCookie } from "@/app/lib/session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}
