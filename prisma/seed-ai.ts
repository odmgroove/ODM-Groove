import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AI_KNOWLEDGE: {
  question: string | null;
  keywords: string;
  response: string;
  order: number;
}[] = [
  // ── Suggested Questions (shown as quick-tap chips in the widget) ──────────────
  {
    question: "What are your room prices?",
    keywords: "price,prices,room price,how much,cost,rate,rates,affordable,cheap,expensive",
    response: "We have three room tiers at ODM Groove Hotel:\n\n🛏️ **Standard Room — ₦30,000/night**\nKing-size Bed, Free Breakfast, High-Speed WiFi, Smart TV (Netflix & DSTV), Air Conditioning, 24/7 Hot Water, Private Bathroom & Daily Housekeeping.\n\n🌟 **Mid-Tier Room — ₦40,000/night**\nAll Standard amenities PLUS Mini Fridge, Work Desk & Swimming Pool Access.\n\n👑 **Deluxe / Executive Suite — ₦50,000/night**\nAll Mid-Tier amenities PLUS a Lounge Area & Premium Minibar — the ultimate staycation experience.\n\nWould you like to book a room?",
    order: 0,
  },
  {
    question: "How do I book a room?",
    keywords: "book,booking,reserve,reservation,how to book,make a booking,available",
    response: "Booking is easy! You can:\n\n1️⃣ Click the **'Book Now'** button on our Rooms section on this website — it connects you directly to our reservations team via WhatsApp.\n\n2️⃣ Call us on **07061514120** or **09049180725**\n\n3️⃣ Message us on WhatsApp at **+234 706 151 4120**\n\nOur team will confirm availability and secure your reservation! 🏨",
    order: 1,
  },
  {
    question: "Where are you located?",
    keywords: "location,address,where,directions,how to get,find you,locate,map,ijoko",
    response: "📍 ODM Groove Hotel is located at:\n\n**Shonekan Street, Ola-Oparun, After Aboki Ifa Villa, Ijoko Ogbayo, Ogun State.**\n\nWe're easily accessible — just a short drive from Lagos. Our team can also help with specific directions. Call us on 07061514120 or message us on WhatsApp! 🗺️",
    order: 2,
  },
  {
    question: "Do you have a swimming pool?",
    keywords: "pool,swimming,swim,splash,water,poolside",
    response: "Yes! 🏊 We have a beautiful swimming pool open to guests.\n\n💦 **Pool Access Pricing:**\n- Adult (1 person) — ₦3,000\n- 4 Adults Package — ₦10,000 (great savings!)\n- Child (1 child) — ₦2,000\n- 4 Children Package — ₦6,000\n\n🌟 Deluxe Room guests get **FREE pool access** included in their stay!\n\nPerfect for a relaxing day out with family or friends.",
    order: 3,
  },
  {
    question: "What events do you host?",
    keywords: "event,events,party,parties,pool party,nightclub,club,dj,music,concert,celebration",
    response: "ODM Groove is a premium entertainment hub! 🎉 We host:\n\n🎵 **Pool Parties** — Afrobeats & Amapiano vibes with top DJs\n🥂 **VIP Club Nights** — Premium bottle service, exclusive atmosphere\n🎊 **Private Events** — Birthdays, corporate events, and more\n\nOur Event Hall accommodates 200+ guests.\n\nCheck our **Events** page for upcoming shows, or call 07061514120 to enquire about hosting your own event!",
    order: 4,
  },
  {
    question: "What time is check-in and check-out?",
    keywords: "check in,check out,checkin,checkout,check-in,check-out,arrival,departure,time",
    response: "⏰ **Check-in:** From 2:00 PM\n\n⏰ **Check-out:** By 12:00 PM (Noon)\n\nNeed an early check-in or late check-out? We can try to arrange it for you subject to availability. Just call us on **07061514120** and we'll do our best to accommodate you! 🤝",
    order: 5,
  },

  // ── Non-suggested (keyword-only) entries ─────────────────────────────────────
  {
    question: null,
    keywords: "wifi,internet,connection,network,broadband",
    response: "Yes! All rooms at ODM Groove include **High-Speed WiFi** at no extra charge. Stay connected throughout your entire visit. 📶",
    order: 6,
  },
  {
    question: null,
    keywords: "breakfast,food,meal,eat,dining,restaurant,kitchen",
    response: "🍳 **Free Breakfast** is included with every room booking!\n\nOur kitchen menu also features a wide range of meals including Jollof Rice, Fried Rice, Swallow & Soups, Peppered Meats, and more.\n\nYou can view our full menu on the **Menu** page of our website.",
    order: 7,
  },
  {
    question: null,
    keywords: "bar,drinks,alcohol,beer,wine,spirits,cocktail,shisha,vip lounge",
    response: "🍹 Our bar is fully stocked! We offer:\n\n🍺 **Beers** — Trophy, Heineken, Guinness, Budweiser & more\n🥃 **Spirits** — Hennessy, Martell, Jack Daniel's, Jameson & more\n🍷 **Wines & Champagne** — Moët, Belaire Rosé, Martini Rose\n💨 **Shisha** — Single & double hose options\n\nVIP Lounge pricing is also available. Check our full **Menu** page for all prices!",
    order: 8,
  },
  {
    question: null,
    keywords: "parking,park,car,vehicle,security",
    response: "🚗 Yes! We provide **ample free on-site parking** for all guests.\n\n🔒 The premises are heavily secured with 24/7 security personnel and surveillance systems, so your vehicle is safe with us.",
    order: 9,
  },
  {
    question: null,
    keywords: "event hall,hall,wedding,seminar,conference,corporate,reception,party hall,venue",
    response: "🏛️ Our **Event Hall** is perfect for any occasion!\n\n✅ Capacity: 200+ guests\n✅ Fully Air-Conditioned\n✅ 24/7 Security & Surveillance\n✅ Free On-Site Parking\n✅ Direct access to our premium Kitchen & Bar\n\nTo enquire about booking the hall for your event, call us on **07061514120** or **09049180725**.",
    order: 10,
  },
  {
    question: null,
    keywords: "contact,phone,call,whatsapp,number,reach,speak",
    response: "📞 You can reach us through:\n\n📱 **Phone:** 07061514120 | 09049180725\n💬 **WhatsApp:** +234 706 151 4120\n\nOur team is available to assist you with bookings, enquiries, and reservations. Don't hesitate to reach out! 😊",
    order: 11,
  },
  {
    question: null,
    keywords: "snooker,billiard,pool table,game",
    response: "🎱 We have professional **Snooker tables** available!\n\nPricing: **₦1,000 per coin** (one coin = one game)\n\nA great way to relax and have fun during your stay.",
    order: 12,
  },
  {
    question: null,
    keywords: "tv,television,netflix,dstv,cable,entertainment",
    response: "📺 All rooms come with a **Smart TV** loaded with both **Netflix** and **DSTV**. Enjoy premium entertainment right from your room at no extra cost!",
    order: 13,
  },
  {
    question: null,
    keywords: "ac,air condition,air conditioning,fan,cool,temperature",
    response: "❄️ All rooms are fully **Air Conditioned** for your comfort. You can adjust the temperature to your liking throughout your stay.",
    order: 14,
  },
  {
    question: null,
    keywords: "minibar,fridge,mini bar,drinks in room,room service",
    response: "🥂 Our **Deluxe Room** includes a **Premium Minibar** stocked for your convenience.\n\nFor room service orders, you can also contact our staff directly during your stay.",
    order: 15,
  },
  {
    question: null,
    keywords: "capacity,how many,guest,guests,how many people,person,persons",
    response: "Each room at ODM Groove accommodates up to **2 guests** comfortably.\n\nFor group bookings or larger parties, please contact us directly on **07061514120** so we can find the best arrangement for your group. 👥",
    order: 16,
  },
];

async function main() {
  console.log('Seeding AI knowledge base...');
  let created = 0;
  let skipped = 0;

  for (const entry of AI_KNOWLEDGE) {
    const existing = await prisma.aiKnowledge.findFirst({
      where: { keywords: entry.keywords },
    });

    if (!existing) {
      await prisma.aiKnowledge.create({ data: entry });
      console.log(`✅ Created: "${entry.question ?? entry.keywords.split(',')[0]}"`);
      created++;
    } else {
      // Update in case content changed
      await prisma.aiKnowledge.update({
        where: { id: existing.id },
        data: { question: entry.question, response: entry.response, order: entry.order },
      });
      console.log(`🔄 Updated: "${entry.question ?? entry.keywords.split(',')[0]}"`);
      skipped++;
    }
  }

  console.log(`\nDone! ${created} created, ${skipped} updated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
