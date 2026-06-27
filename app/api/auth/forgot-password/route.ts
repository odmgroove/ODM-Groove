import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      // Always return 200 to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    // Generate a secure reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reset-password?token=${token}`;

    await resend.emails.send({
      from: "ODM Groove <noreply@odmgroove.com>",
      to: email,
      subject: "Password Reset Request - ODM Groove",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 12px; border: 1px solid #333;">
          <h2 style="color: #d4af37; text-align: center; margin-bottom: 30px;">ODM GROOVE HOTEL</h2>
          <h3 style="margin-bottom: 20px;">Password Reset</h3>
          <p style="color: #a3a3a3; line-height: 1.6;">You requested a password reset for your admin account. Click the button below to set a new password. This link expires in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #d4af37; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #737373; font-size: 12px; text-align: center; margin-top: 40px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
