import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BLOG_POSTS = [
  {
    title: "Hosting the Perfect Wedding Reception in Ogun State",
    slug: "hosting-perfect-wedding-reception-ogun-state",
    excerpt: "Discover the secrets to a flawless wedding reception, from selecting the right catering to ambient lighting in our grand event hall.",
    content: "<p>Discover the secrets to a flawless wedding reception, from selecting the right catering to ambient lighting in our grand event hall.</p><p>Planning a wedding can be stressful, but at ODM Groove, our dedicated event staff ensures your special day is perfect. With our state-of-the-art facilities, customizable lighting, and premium catering options, your wedding reception will be an unforgettable experience for you and your guests.</p>",
    coverImage: "/odm-groove-hotel-exterior-daytime.jpg",
    author: "ODM Admin",
    published: true,
    tags: "EVENTS",
    createdAt: new Date("2026-02-15T00:00:00Z"),
  },
  {
    title: "Top 5 Reasons to Choose a Boutique Hotel",
    slug: "top-5-reasons-to-choose-a-boutique-hotel",
    excerpt: "Why personalized service, unique aesthetics, and quieter environments make boutique hotels like ODM Groove the superior choice for your...",
    content: "<p>Why personalized service, unique aesthetics, and quieter environments make boutique hotels like ODM Groove the superior choice for your next getaway.</p><p>Unlike large chain hotels, boutique hotels offer a unique charm and highly personalized service. At ODM Groove, every guest is treated like royalty. Enjoy our exclusively designed rooms, intimate atmosphere, and dedicated staff who anticipate your every need.</p>",
    coverImage: "/Room/odm-groove-hotel-room-50k-1.jpg",
    author: "Guest Relations",
    published: true,
    tags: "HOSPITALITY",
    createdAt: new Date("2026-02-02T00:00:00Z"),
  },
  {
    title: "The Rise of Ijoko's Nightlife Scene",
    slug: "the-rise-of-ijoko-nightlife-scene",
    excerpt: "A look into how local establishments are transforming the evening entertainment landscape in Ijoko Ogbayo.",
    content: "<p>A look into how local establishments are transforming the evening entertainment landscape in Ijoko Ogbayo.</p><p>Ijoko's nightlife is undergoing a vibrant transformation, and ODM Groove is at the heart of it. From our exclusive VIP club nights to lively poolside parties, we are setting a new standard for premium entertainment in Ogun State.</p>",
    coverImage: "/Outdoor night view/odm-groove-nightlife-outdoor-2.jpg",
    author: "Lifestyle Editor",
    published: true,
    tags: "NIGHTLIFE",
    createdAt: new Date("2026-01-20T00:00:00Z"),
  },
  {
    title: "Relaxation Redefined: Our Poolside Experience",
    slug: "relaxation-redefined-our-poolside-experience",
    excerpt: "What to expect when you book a Deluxe room and spend your afternoon lounging by our pristine outdoor pool.",
    content: "<p>What to expect when you book a Deluxe room and spend your afternoon lounging by our pristine outdoor pool.</p><p>There's nothing quite like a refreshing dip in our crystal-clear pool after a long day. Order a cocktail from the bar, relax on our comfortable loungers, and soak up the sun. The poolside at ODM Groove is your ultimate urban oasis.</p>",
    coverImage: "/odm-groove-hotel-front-view.jpg",
    author: "ODM Admin",
    published: true,
    tags: "LEISURE",
    createdAt: new Date("2026-01-05T00:00:00Z"),
  }
];

async function main() {
  console.log("Seeding blog posts...");
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`Upserted post: ${post.title}`);
  }
  console.log("Blog seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
