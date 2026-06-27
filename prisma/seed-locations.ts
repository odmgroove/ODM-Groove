import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const defaultLocations = [
    { name: "Main Bar",    description: "Primary bar serving general floor customers" },
    { name: "VIP Lounge",  description: "Exclusive VIP area with premium pricing" },
    { name: "Rooftop",     description: "Rooftop bar and lounge" },
    { name: "Pool Bar",    description: "Poolside bar service" },
    { name: "Snooker Room", description: "Bar service at snooker room" },
  ];

  for (const loc of defaultLocations) {
    await prisma.storeLocation.upsert({
      where: { name: loc.name },
      update: {},
      create: loc,
    });
  }

  console.log(`✅ Seeded ${defaultLocations.length} store locations.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
