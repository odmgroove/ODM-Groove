import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding blog posts...");

  const blogPosts = [
    {
      title: "Welcome to ODM Groove: Your Premium Hotel Experience in Ogun State",
      slug: "welcome-to-odm-groove",
      excerpt: "Discover unparalleled luxury and comfort right here in Ijoko. Our new state-of-the-art facility is now open to guests.",
      content: "<p>We are thrilled to officially welcome you to ODM Groove Hotel & Event Hall. Designed to offer a premium lifestyle experience, our facility combines modern architecture with world-class hospitality.</p><p>Whether you're looking for a relaxing weekend getaway in our Deluxe Rooms, planning a grand wedding in our spacious Event Hall, or seeking the best nightlife experience in Ogun State, we have everything you need under one roof.</p>",
      coverImage: "/odm-groove-hotel-exterior-daytime.jpg",
      author: "Admin",
      published: true,
      tags: "News,Hotel",
    },
    {
      title: "Top 5 Reasons to Host Your Next Event at ODM Groove Hall",
      slug: "top-5-reasons-to-host-event-odm-groove",
      excerpt: "Planning an event? Here's why our versatile event hall is the perfect choice for your next big celebration.",
      content: "<p>Choosing the right venue is the most crucial part of event planning. At ODM Groove, we offer a dynamic space that can be tailored to any occasion.</p><ul><li><strong>Capacity:</strong> Comfortably hosts upwards of 200 guests.</li><li><strong>Security:</strong> 24/7 surveillance and on-site security personnel.</li><li><strong>Ample Parking:</strong> Secure, free parking for all guests.</li><li><strong>Luxury Ambience:</strong> Fully air-conditioned and beautifully designed.</li><li><strong>Catering Available:</strong> Direct access to our premium kitchen and bar services.</li></ul>",
      coverImage: "/Hall/odm-groove-event-hall-front-view.jpg",
      author: "Event Manager",
      published: true,
      tags: "Events,Wedding",
    },
    {
      title: "Experience the Best Nightlife at Our VIP Club",
      slug: "best-nightlife-vip-club",
      excerpt: "Step into the night and let the music take control. Our club offers an exclusive nightlife experience you won't forget.",
      content: "<p>Weekends in Ogun State just got an upgrade. Our VIP club features top DJs, premium bottle service, and an electrifying atmosphere.</p><p>From high-energy Afrobeats to smooth Amapiano, our sound system delivers pure vibes. Book a VIP table for your crew and enjoy dedicated service throughout the night.</p>",
      coverImage: "/Bar/odm-groove-vip-bar-lounge-1.jpg",
      author: "Admin",
      published: true,
      tags: "Nightlife,Club",
    }
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  
  console.log("✅ Blog posts seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
