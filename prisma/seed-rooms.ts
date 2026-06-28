import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ROOMS_DATA = [
  { name: "Cedar Room", price: 30000, capacity: 2, description: "A cozy and comfortable standard room perfect for short stays.", features: "Queen Size Bed, Air Conditioning, En-suite Bathroom, WiFi, TV, Coffee", image: "/Room/odm-groove-hotel-room-30k-1.jpg" },
  { name: "Rosewood Room", price: 30000, capacity: 2, description: "Elegant standard room with modern amenities.", features: "Queen Size Bed, Air Conditioning, En-suite Bathroom, WiFi, TV, Coffee", image: "/Room/odm-groove-hotel-room-30k-2.jpg" },
  { name: "Marple Room", price: 40000, capacity: 2, description: "Spacious deluxe room offering extra comfort and style.", features: "King Size Bed, Mini Fridge, Work Desk, Air Conditioning, WiFi, TV, Pool Access", image: "/Room/odm-groove-hotel-room-40k-1.jpg" },
  { name: "Cherry Room", price: 50000, capacity: 2, description: "Premium executive suite designed for the ultimate staycation.", features: "King Size Bed, Lounge Area, Mini Bar, City View, WiFi, TV, Pool Access", image: "/Room/odm-groove-hotel-room-50k-1.jpg" },
  { name: "Basswood Room", price: 50000, capacity: 2, description: "Luxurious executive suite with premium furnishings.", features: "King Size Bed, Lounge Area, Mini Bar, Premium Bedding, WiFi, TV, Pool Access", image: "/Room/odm-groove-hotel-room-50k-2.jpg" },
  { name: "Pine Room", price: 50000, capacity: 2, description: "Sophisticated executive suite for a relaxing getaway.", features: "King Size Bed, Lounge Area, Mini Bar, Premium Bedding, WiFi, TV, Pool Access", image: "/Room/odm-groove-hotel-room-50k-3.jpg" },
  { name: "Oak Room", price: 50000, capacity: 2, description: "Classic executive suite with timeless decor.", features: "King Size Bed, Lounge Area, Mini Bar, Premium Bedding, WiFi, TV, Pool Access", image: "/Room/odm-groove-hotel-room-50k-4.jpg" },
  { name: "Walnut Room", price: 50000, capacity: 2, description: "Upscale executive suite for a lavish experience.", features: "King Size Bed, Lounge Area, Mini Bar, Premium Bedding, WiFi, TV, Pool Access", image: "/Room/odm-groove-hotel-room-50k-5.jpg" },
  { name: "Redwood Room", price: 50000, capacity: 2, description: "The pinnacle of luxury in our executive suite collection.", features: "King Size Bed, Lounge Area, Mini Bar, Premium Bedding, WiFi, TV, Pool Access", image: "/Room/odm-groove-hotel-room-50k-toilet-1.jpg" },
];

async function main() {
  console.log('Seeding rooms...');
  for (const room of ROOMS_DATA) {
    const existing = await prisma.room.findFirst({ where: { name: room.name } });
    
    if (existing) {
      await prisma.room.update({
        where: { id: existing.id },
        data: { image: room.image }
      });
      console.log(`Updated ${room.name} with new image`);
    } else {
      await prisma.room.create({ data: room });
      console.log(`Created ${room.name}`);
    }
  }
  console.log('Done seeding rooms.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
