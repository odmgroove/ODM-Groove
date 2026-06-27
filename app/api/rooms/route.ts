import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const STD_DESC = "Our Standard Room offers all the comfort you need for a perfect stay — tastefully furnished with a plush bed, air conditioning, and smart TV. Wake up to a complimentary breakfast and enjoy seamless connectivity throughout your visit.";
const STD_FEATURES = "Free Daily Breakfast, High-Speed WiFi, Netflix & DSTV, Comfortable Bed, Air Conditioning, En-suite Bathroom, 24/7 Power Supply, Premium Toiletries, Wardrobe & Storage, Room Service";

const DLX_DESC = "Experience elevated luxury in our Deluxe Room — all the Standard benefits plus exclusive access to our stunning outdoor swimming pool. More space, premium toiletries, and a truly indulgent ambience perfect for that special staycation.";
const DLX_FEATURES = "Free Daily Breakfast, High-Speed WiFi, Netflix & DSTV, Pool Access Included, Spacious Layout, Swimming Pool Access, Air Conditioning, En-suite Bathroom, 24/7 Power Supply, Premium Toiletries, Wardrobe & Storage, Room Service";

const ROOM_IMAGE_STD = "/Room/odm-groove-hotel-room-40k-1.jpg";

const DEFAULT_ROOMS = [
  // ── ₦30,000 Standard Rooms ─────────────────────────────────────────────────
  { name: "Cedar Room",    price: 30000, capacity: 2, description: STD_DESC, features: STD_FEATURES, image: ROOM_IMAGE_STD },
  { name: "Rosewood Room", price: 30000, capacity: 2, description: STD_DESC, features: STD_FEATURES, image: ROOM_IMAGE_STD },
  // ── ₦40,000 Deluxe Room ─────────────────────────────────────────────────────
  { name: "Marple Room",   price: 40000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: ROOM_IMAGE_STD },
  // ── ₦50,000 Executive Rooms ─────────────────────────────────────────────────
  { name: "Cherry Room",   price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: ROOM_IMAGE_STD },
  { name: "Basswood Room", price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: ROOM_IMAGE_STD },
  { name: "Pine Room",     price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: ROOM_IMAGE_STD },
  { name: "Oak Room",      price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: ROOM_IMAGE_STD },
  { name: "Walnut Room",   price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: ROOM_IMAGE_STD },
  { name: "Redwood Room",  price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: ROOM_IMAGE_STD },
];

// Old incorrect generic room names created by bad seed attempts — delete these automatically
const LEGACY_BAD_NAMES = ["Standard Room", "Deluxe Room", "Executive Room", "Standard", "Deluxe", "Executive"];

export async function GET() {
  try {
    // ── Step 1: Auto-delete legacy bad-seed room names ────────────────────────
    await prisma.room.deleteMany({
      where: { name: { in: LEGACY_BAD_NAMES } }
    });

    // ── Step 2: Upsert canonical rooms (create or update existing records) ────
    // This ensures existing rooms get the latest descriptions & features
    for (const room of DEFAULT_ROOMS) {
      const existing = await prisma.room.findFirst({ where: { name: room.name } });
      if (!existing) {
        await prisma.room.create({ data: room });
      } else {
        // Update description and features to keep them fresh, but preserve admin overrides for price/image/availability
        await prisma.room.update({
          where: { id: existing.id },
          data: {
            description: room.description,
            features: room.features,
          }
        });
      }
    }

    const rooms = await prisma.room.findMany({ orderBy: { price: "asc" } });
    return NextResponse.json(rooms);
  } catch (err) {
    console.error("GET /api/rooms error:", err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const room = await prisma.room.create({ data: body });
    return NextResponse.json(room, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}

