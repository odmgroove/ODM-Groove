import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Resend } from "resend";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const booking = await prisma.booking.create({ data: body });

    // Send Admin Email Notification
    try {
      if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "ODM Groove <onboarding@resend.dev>", // resend dev email
          to: process.env.ADMIN_EMAIL,
          subject: `New Booking Confirmed: ${booking.id}`,
          html: `
            <h2>New Booking Received!</h2>
            <p>A new booking has been confirmed on the ODM Groove website.</p>
            <ul>
              <li><strong>Ref:</strong> ${booking.id}</li>
              <li><strong>Name:</strong> ${booking.name}</li>
              <li><strong>Email:</strong> ${booking.email || "N/A"}</li>
              <li><strong>Phone:</strong> ${booking.phone}</li>
              <li><strong>Date:</strong> ${booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : "N/A"}</li>
              <li><strong>Notes:</strong> ${booking.notes || "None"}</li>
            </ul>
            <p>Please log in to the admin dashboard to view full details.</p>
          `,
        });
        console.log("Admin email notification sent for booking", booking.id);
      }
    } catch (emailErr) {
      console.error("Failed to send admin email notification:", emailErr);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
