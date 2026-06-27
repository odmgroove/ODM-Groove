import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clear all existing data first (safe to re-run) ─────────────────────────
  console.log("🗑️  Clearing existing data...");
  await prisma.menuItem.deleteMany();
  await prisma.room.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.event.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.booking.deleteMany();
  // Note: we do NOT delete adminUser so password resets are preserved


  // ── Admin Users ──────────────────────────────────────────────────────────────
  const ALL_PERMISSIONS = JSON.stringify([
    "view:kitchen", "view:bar", "create:orders", "manage:inventory",
    "view:analytics", "manage:staff", "view:shifts", "manage:rooms",
    "manage:events", "manage:blog", "manage:gallery", "manage:faqs",
    "view:bookings", "manage:ai"
  ]);

  // Regular admin
  const hashedPassword = await bcrypt.hash("$odmgroove2024$", 12);
  await prisma.adminUser.upsert({
    where: { email: "odmgroove@gmail.com" },
    update: {},
    create: {
      email: "odmgroove@gmail.com",
      name: "ODM Groove Admin",
      password: hashedPassword,
      permissions: ALL_PERMISSIONS,
    },
  });

  // Super Admin — permanent, cannot be deleted
  const superAdminPassword = await bcrypt.hash("Xan##tozzy99", 12);
  await prisma.adminUser.upsert({
    where: { email: "hatykuxordik@gmail.com" },
    update: { isSuperAdmin: true, permissions: ALL_PERMISSIONS }, // always ensure super
    create: {
      email: "hatykuxordik@gmail.com",
      name: "Super Admin",
      password: superAdminPassword,
      isSuperAdmin: true,
      permissions: ALL_PERMISSIONS,
    },
  });
  console.log("✅ Admin users seeded (including Super Admin)");

  // ── Events ──────────────────────────────────────────────────────────────────
  await prisma.event.upsert({
    where: { id: "get-wet-pool-party-2026" },
    update: {},
    create: {
      id: "get-wet-pool-party-2026",
      title: "Get Wet",
      subtitle: "Water Splash Pool Party",
      description: "One night. One pool. One unforgettable vibe.",
      longDescription:
        "Immerse yourself in a grooving environment, crystal-clear waters, and an atmosphere unlike anything this season has offered. Whether you're splashing in the pool, vibing to the hottest Afrobeats and Amapiano sets, or locking in a private table for your crew — the Get Wet Water Splash Pool Party is built for those who play hard.",
      date: new Date("2026-05-16T17:00:00"),
      endTime: "Till Dawn",
      venue: "Shonekan Street, Olaoparun, After Aboki-Ifa Villa, Ijoko · Ogba-Ayo · Ogun State",
      category: "pool-party",
      status: "past",
      featured: false,
      ticketPrices: JSON.stringify([{ label: "Guys", price: 5000 }, { label: "Girls", price: 3000 }]),
      contactNumbers: "07061514120,09049180725",
      hashtags: "#PoolParty,#VDJTiko,#ODMGroove,#GetWet,#WaterSplash,#TropicalVibes",
      whatsappNumber: "2347061514120",
      image: "/events/pool-party-2026.jpeg",
      posterImage: "/events/pool-party-2026.jpeg",
      accentColor: "#00b4d8",
      artists: "VDJ Tiko,ODM Groove",
      ageLimit: 18,
      extras: "Water guns available for sale at venue,Maximum security guaranteed,Room & table reservations available",
    },
  });
  console.log("✅ Events seeded");

  // ── FAQs ────────────────────────────────────────────────────────────────────
  const faqs = [
    { question: "Where is ODM Groove Hotel located?", answer: "We are located at Shonekan Street, Ola-Oparun, After Aboki Ifa Villa in Ijoko Ogbayo, Ogun State. Highly accessible, just a short drive from Lagos.", order: 0 },
    { question: "What are your check-in and check-out times?", answer: "Standard check-in time is from 2:00 PM, and check-out is at 12:00 PM (Noon). Early check-in or late check-out can be arranged subject to availability.", order: 1 },
    { question: "What is included in the room price?", answer: "Both our Standard (₦30,000) and Deluxe (₦50,000) rooms include free daily breakfast, high-speed WiFi, air conditioning, and a smart TV with Netflix & DSTV. Deluxe rooms also include free access to the swimming pool.", order: 2 },
    { question: "What is the capacity of the Event Hall?", answer: "Our versatile Event Hall can comfortably accommodate upwards of 200 guests, making it perfect for weddings, corporate seminars, birthday parties, and other grand celebrations.", order: 3 },
    { question: "Do you offer parking and security?", answer: "Yes, we provide ample free on-site parking for all our guests. The premises are heavily secured with 24/7 security personnel and surveillance systems.", order: 4 },
    { question: "How can I book a room or the event hall?", answer: "You can book directly by clicking any of the 'Book Now' buttons on this website, which will connect you to our reservations team via WhatsApp or Phone.", order: 5 },
  ];
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log("✅ FAQs seeded");

  // ── Testimonials ─────────────────────────────────────────────────────────────
  const testimonials = [
    { name: "Samuel O.", role: "Business Traveler", content: "The Wifi is incredibly fast and dependable. The Standard Room was pristine and very comfortable. Will definitely be returning on my next trip to Ogun State.", rating: 5, visible: true },
    { name: "Adesuwa M.", role: "Staycation Guest", content: "My weekend stay in the Deluxe Room was absolute perfection. The pool area is beautiful, the staff is very warm and welcoming, and sipping cocktails at the rooftop bar was the highlight of my trip.", rating: 5, visible: true },
    { name: "Chukwudi E.", role: "Event Organizer", content: "We hosted a 150-guest wedding reception at the ODM Groove event hall. The venue was spacious, fully air-conditioned, and the security was top-notch. Highly recommend for any major event near Lagos.", rating: 4, visible: true },
    { name: "Biola T.", role: "Local Resident", content: "Such a hidden gem in Ijoko! The nightclub has great energy on weekends, and the rooms give you a nice quiet retreat afterwards. You get much more luxury than what you pay for.", rating: 5, visible: true },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("✅ Testimonials seeded");

  // ── Rooms ───────────────────────────────────────────────────────────────────
  const rooms = [
    {
      name: "Standard Room",
      description: "Ideal for solo travelers and couples seeking premium comfort at an accessible price point.",
      price: 30000,
      capacity: 2,
      features: "King-size Bed,Free Breakfast,High-Speed WiFi,Smart TV (Netflix & DSTV),Air Conditioning,24/7 Hot Water,Private Bathroom,Daily Housekeeping",
    },
    {
      name: "Deluxe Room",
      description: "An elevated escape with panoramic views, exclusive amenities, and complete privacy.",
      price: 50000,
      capacity: 2,
      features: "King-size Bed,Free Breakfast,High-Speed WiFi,Smart TV (Netflix & DSTV),Air Conditioning,24/7 Hot Water,Private Bathroom,Daily Housekeeping,Free Pool Access,Premium Minibar",
    },
  ];
  for (const room of rooms) {
    await prisma.room.create({ data: room });
  }
  console.log("✅ Rooms seeded");

  // ── Menu Items ───────────────────────────────────────────────────────────────
  const menuItems = [
    // Food - Breakfast
    { name: "Boiled Yam & Egg", price: 5500, category: "food", subcategory: "Breakfast", emoji: "🍳", description: "Includes tea, coffee or bottled water", order: 0 },
    { name: "Boiled Plantain & Egg", price: 5500, category: "food", subcategory: "Breakfast", emoji: "🍌", description: "Includes tea, coffee or bottled water", order: 1 },
    { name: "Fried Plantain & Egg", price: 5500, category: "food", subcategory: "Breakfast", emoji: "🍳", description: "Includes tea, coffee or bottled water", order: 2 },
    { name: "Bread & Fried Eggs", price: 5500, category: "food", subcategory: "Breakfast", emoji: "🍞", description: "Includes tea, coffee or bottled water", order: 3 },
    { name: "Toast Bread / Sandwich", price: 6500, category: "food", subcategory: "Breakfast", emoji: "🥪", description: "Includes tea, coffee or bottled water", order: 4 },
    // Food - Rice & Pasta
    { name: "Jollof Rice & Turkey", price: 8500, category: "food", subcategory: "Rice & Pasta", emoji: "🍚", tag: "popular", order: 5 },
    { name: "Jollof Rice & Chicken", price: 8500, category: "food", subcategory: "Rice & Pasta", emoji: "🍚", tag: "popular", order: 6 },
    { name: "Fried Rice & Turkey", price: 8500, category: "food", subcategory: "Rice & Pasta", emoji: "🍛", order: 7 },
    { name: "Fried Rice & Chicken", price: 8500, category: "food", subcategory: "Rice & Pasta", emoji: "🍛", order: 8 },
    { name: "Spaghetti & Turkey", price: 7500, category: "food", subcategory: "Rice & Pasta", emoji: "🍝", order: 9 },
    { name: "Spaghetti & Chicken", price: 7500, category: "food", subcategory: "Rice & Pasta", emoji: "🍝", order: 10 },
    { name: "Indomie & Egg", price: 3500, category: "food", subcategory: "Rice & Pasta", emoji: "🍜", order: 11 },
    { name: "Indomie & Chicken", price: 7500, category: "food", subcategory: "Rice & Pasta", emoji: "🍜", order: 12 },
    { name: "Indomie & Turkey", price: 7500, category: "food", subcategory: "Rice & Pasta", emoji: "🍜", order: 13 },
    // Food - Swallow
    { name: "Swallow Combo", price: 9000, category: "food", subcategory: "Swallow", emoji: "🫕", description: "Choice of: Egusi, Efo Riro or Ogbono Soup — with Chicken, Turkey or Fish", tag: "popular", order: 14 },
    // Food - Appetizers
    { name: "Peppered Beef", price: 2000, category: "food", subcategory: "Appetizers", emoji: "🥩", order: 15 },
    { name: "Peppered Chicken", price: 5000, category: "food", subcategory: "Appetizers", emoji: "🍗", order: 16 },
    { name: "Peppered Turkey", price: 5000, category: "food", subcategory: "Appetizers", emoji: "🍗", order: 17 },
    // Food - Pepper Soup
    { name: "Assorted Meat Pepper Soup", price: 2000, category: "food", subcategory: "Pepper Soup", emoji: "🥘", order: 18 },
    { name: "Chicken Pepper Soup", price: 5000, category: "food", subcategory: "Pepper Soup", emoji: "🥘", order: 19 },
    { name: "Turkey Pepper Soup", price: 5000, category: "food", subcategory: "Pepper Soup", emoji: "🥘", order: 20 },
    { name: "Goat Meat Pepper Soup", price: 7000, category: "food", subcategory: "Pepper Soup", emoji: "🥘", tag: "popular", order: 21 },
    // Beers
    { name: "Trophy Beer", price: 1500, category: "beers", emoji: "🍺", order: 0 },
    { name: "Small Smirnoff Ice", price: 1500, category: "beers", emoji: "🍺", order: 1 },
    { name: "Big Smirnoff Ice", price: 2500, category: "beers", emoji: "🍺", tag: "popular", order: 2 },
    { name: "Guinness Stout (Big)", price: 2500, category: "beers", emoji: "🍺", order: 3 },
    { name: "Guinness Stout (Small)", price: 1500, category: "beers", emoji: "🍺", order: 4 },
    { name: "Goldberg", price: 1500, category: "beers", emoji: "🍺", order: 5 },
    { name: "Star Radler", price: 1300, category: "beers", emoji: "🍺", order: 6 },
    { name: "William Beer", price: 1500, category: "beers", emoji: "🍺", order: 7 },
    { name: "Gulder", price: 2000, category: "beers", emoji: "🍺", order: 8 },
    { name: "33 Export", price: 1500, category: "beers", emoji: "🍺", order: 9 },
    { name: "Heineken", price: 2000, category: "beers", emoji: "🍺", tag: "popular", order: 10 },
    { name: "Legend Stout", price: 2000, category: "beers", emoji: "🍺", order: 11 },
    { name: "Budweiser", price: 2000, category: "beers", emoji: "🍺", order: 12 },
    { name: "Desperado", price: 1500, category: "beers", emoji: "🍺", order: 13 },
    // Spirits
    { name: "Martell V.S", price: 90000, category: "spirits", emoji: "🥃", tag: "popular", order: 0 },
    { name: "Martell Blue Swift (V.S.O.P)", price: 130000, category: "spirits", emoji: "🥃", order: 1 },
    { name: "Olmeca Tequila", price: 45000, category: "spirits", emoji: "🥃", order: 2 },
    { name: "Jameson Original", price: 40000, category: "spirits", emoji: "🥃", tag: "popular", order: 3 },
    { name: "Jameson Black Barrel", price: 65000, category: "spirits", emoji: "🥃", order: 4 },
    { name: "Campari (Small)", price: 13500, category: "spirits", emoji: "🥃", order: 5 },
    { name: "Campari (Big)", price: 30000, category: "spirits", emoji: "🥃", order: 6 },
    { name: "Chivas Regal", price: 35000, category: "spirits", emoji: "🥃", order: 7 },
    { name: "Best Whiskey", price: 12000, category: "spirits", emoji: "🥃", order: 8 },
    { name: "Best Cream", price: 15000, category: "spirits", emoji: "🥃", order: 9 },
    { name: "Hennessy V.S", price: 80000, category: "spirits", emoji: "🥃", tag: "popular", order: 10 },
    { name: "Hennessy V.S.O.P", price: 130000, category: "spirits", emoji: "🥃", order: 11 },
    { name: "Casamigos Gold Tequila", price: 220000, category: "spirits", emoji: "🥃", order: 12 },
    { name: "Casamigos White Tequila", price: 200000, category: "spirits", emoji: "🥃", order: 13 },
    { name: "Jack Daniel's", price: 40000, category: "spirits", emoji: "🥃", tag: "popular", order: 14 },
    { name: "Magic Moment Vodka", price: 15000, category: "spirits", emoji: "🥃", order: 15 },
    { name: "Remy Martin V.S.O.P", price: 100000, category: "spirits", emoji: "🥃", order: 16 },
    { name: "Remy Martin 1738 VS", price: 150000, category: "spirits", emoji: "🥃", order: 17 },
    { name: "Absolute Vodka", price: 30000, category: "spirits", emoji: "🥃", order: 18 },
    { name: "Bacardi Carta Oro (75cl)", price: 35000, category: "spirits", emoji: "🥃", order: 19 },
    { name: "Bacardi Carta Blanca (75cl)", price: 30000, category: "spirits", emoji: "🥃", order: 20 },
    { name: "Smirnoff Ice Vodka", price: 12000, category: "spirits", emoji: "🥃", order: 21 },
    { name: "Gordon's Gin", price: 12500, category: "spirits", emoji: "🥃", order: 22 },
    { name: "Origin Bitters (Bottle)", price: 8000, category: "spirits", emoji: "🥃", order: 23 },
    { name: "Origin Bitters (Pet)", price: 4000, category: "spirits", emoji: "🥃", order: 24 },
    // Wines
    { name: "Martini Rose", price: 25000, category: "wines", emoji: "🍷", tag: "popular", order: 0 },
    { name: "Andre Rose", price: 20000, category: "wines", emoji: "🍷", order: 1 },
    { name: "Four Cousins", price: 18000, category: "wines", emoji: "🍷", order: 2 },
    { name: "4th Street", price: 15000, category: "wines", emoji: "🍷", order: 3 },
    { name: "Agor Wine", price: 15000, category: "wines", emoji: "🍷", order: 4 },
    { name: "Baron Wine", price: 12000, category: "wines", emoji: "🍷", order: 5 },
    { name: "Moët & Chandon Rosé", price: 160000, category: "wines", subcategory: "Champagne", emoji: "🥂", tag: "popular", order: 6 },
    { name: "Belaire Rosé", price: 95000, category: "wines", subcategory: "Champagne", emoji: "🥂", order: 7 },
    // Shots
    { name: "William Lawson Shot", price: 2500, category: "shots", emoji: "🥂", order: 0 },
    { name: "Bacardi Carta Blanca Shot", price: 3000, category: "shots", emoji: "🥂", order: 1 },
    { name: "Olmeca Tequila Shot", price: 3500, category: "shots", emoji: "🥂", order: 2 },
    // Soft Drinks
    { name: "Hollandia Yoghurt", price: 3000, category: "softdrinks", emoji: "🥛", order: 0 },
    { name: "Chivita Active Juice", price: 3000, category: "softdrinks", emoji: "🧃", order: 1 },
    { name: "5 Alive", price: 2000, category: "softdrinks", emoji: "🧃", order: 2 },
    { name: "Coca Cola (Pet)", price: 1000, category: "softdrinks", emoji: "🥤", order: 3 },
    { name: "Malt", price: 1000, category: "softdrinks", emoji: "🥤", order: 4 },
    { name: "Fayrouz", price: 1000, category: "softdrinks", emoji: "🥤", order: 5 },
    { name: "Bottled Water (Eva)", price: 1000, category: "softdrinks", emoji: "💧", order: 6 },
    { name: "Bottled Water (Nirvana)", price: 500, category: "softdrinks", emoji: "💧", order: 7 },
    { name: "Climax Energy Drink", price: 1500, category: "softdrinks", subcategory: "Energy Drinks", emoji: "⚡", order: 8 },
    { name: "Red Bull", price: 3000, category: "softdrinks", subcategory: "Energy Drinks", emoji: "⚡", tag: "popular", order: 9 },
    { name: "Monster Energy", price: 3000, category: "softdrinks", subcategory: "Energy Drinks", emoji: "⚡", order: 10 },
    { name: "Power Horse", price: 3000, category: "softdrinks", subcategory: "Energy Drinks", emoji: "⚡", order: 11 },
    { name: "Black Bullet", price: 3500, category: "softdrinks", subcategory: "Energy Drinks", emoji: "⚡", order: 12 },
    // Shisha
    { name: "Shisha (1 Hose)", price: 5000, category: "shisha", emoji: "💨", description: "Single hose hookah with your choice of flavour", order: 0 },
    { name: "Shisha (2 Hoses)", price: 8000, category: "shisha", emoji: "💨", description: "Double hose hookah — great for sharing", tag: "popular", order: 1 },
    // Swimming
    { name: "Swimming Pool – Adult (1 Person)", price: 3000, category: "swimming", emoji: "🏊", description: "Full day access to the swimming pool", order: 0 },
    { name: "Swimming Pool – 4 Adults Package", price: 10000, category: "swimming", emoji: "🏊", description: "4 adults — great savings!", tag: "popular", order: 1 },
    { name: "Swimming Pool – Child (1 Child)", price: 2000, category: "swimming", emoji: "👶", description: "Full day access for children", order: 2 },
    { name: "Swimming Pool – 4 Children Package", price: 6000, category: "swimming", emoji: "👶", description: "4 children package", order: 3 },
    // Snooker
    { name: "Snooker – Per Coin", price: 1000, category: "snooker", emoji: "🎱", description: "One coin = one game on our professional tables", order: 0 },
    // Club
    { name: "Club Entry / Rooftop Access", price: 0, category: "club", emoji: "🎶", description: "Enquire at the front desk for current event pricing", order: 0 },
    // VIP
    { name: "Trophy Beer (VIP)", price: 2500, category: "vip", emoji: "👑", order: 0 },
    { name: "Small Smirnoff Ice (VIP)", price: 2500, category: "vip", emoji: "👑", order: 1 },
    { name: "Big Smirnoff Ice (VIP)", price: 3500, category: "vip", emoji: "👑", order: 2 },
    { name: "Guinness Stout Big (VIP)", price: 3500, category: "vip", emoji: "👑", order: 3 },
    { name: "Guinness Stout Small (VIP)", price: 2500, category: "vip", emoji: "👑", order: 4 },
    { name: "Goldberg (VIP)", price: 2500, category: "vip", emoji: "👑", order: 5 },
    { name: "Star Radler (VIP)", price: 2300, category: "vip", emoji: "👑", order: 6 },
    { name: "William Beer (VIP)", price: 2500, category: "vip", emoji: "👑", order: 7 },
    { name: "Gulder (VIP)", price: 3000, category: "vip", emoji: "👑", order: 8 },
    { name: "33 Export (VIP)", price: 2500, category: "vip", emoji: "👑", order: 9 },
    { name: "Heineken (VIP)", price: 3000, category: "vip", emoji: "👑", order: 10 },
    { name: "Legend Stout (VIP)", price: 3000, category: "vip", emoji: "👑", order: 11 },
    { name: "Budweiser (VIP)", price: 3000, category: "vip", emoji: "👑", order: 12 },
    { name: "Desperado (VIP)", price: 2500, category: "vip", emoji: "👑", order: 13 },
    { name: "Red Label (VIP)", price: 40000, category: "vip", emoji: "👑", tag: "popular", order: 14 },
    { name: "Baileys Original (VIP)", price: 25000, category: "vip", emoji: "👑", order: 15 },
    { name: "William Lawson (VIP)", price: 25000, category: "vip", emoji: "👑", order: 16 },
    { name: "Sierra Tequila (VIP)", price: 22000, category: "vip", emoji: "👑", order: 17 },
    { name: "Ciroc Vodka (VIP)", price: 55000, category: "vip", emoji: "👑", order: 18 },
    { name: "William Lawson Shot (VIP)", price: 3500, category: "vip", emoji: "👑", order: 19 },
    { name: "Bacardi Shot (VIP)", price: 3500, category: "vip", emoji: "👑", order: 20 },
    { name: "Olmeca Tequila Shot (VIP)", price: 4500, category: "vip", emoji: "👑", order: 21 },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }
  console.log(`✅ ${menuItems.length} menu items seeded`);

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
