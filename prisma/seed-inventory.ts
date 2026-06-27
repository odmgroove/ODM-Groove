import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding default inventory items for recipe mapping...")

  const items = [
    // Proteins & Raw Food
    { name: "Raw Eggs", category: "Food Supplies", unit: "pcs", purchaseUnit: "crates", unitsPerPurchaseUnit: 30 },
    { name: "Raw Noodles Pack", category: "Food Supplies", unit: "pcs", purchaseUnit: "cartons", unitsPerPurchaseUnit: 40 },
    { name: "Turkey Portion", category: "Proteins", unit: "pcs", purchaseUnit: "cartons", unitsPerPurchaseUnit: 10 },
    { name: "Raw Spaghetti", category: "Food Supplies", unit: "kg", purchaseUnit: "cartons", unitsPerPurchaseUnit: 20 },
    { name: "Poundo Yam", category: "Food Supplies", unit: "portions", purchaseUnit: "bags", unitsPerPurchaseUnit: 1 },
    { name: "Semo", category: "Food Supplies", unit: "portions", purchaseUnit: "bags", unitsPerPurchaseUnit: 1 },
    { name: "Efo Riro", category: "Food Supplies", unit: "portions", purchaseUnit: "bowls", unitsPerPurchaseUnit: 1 },
    { name: "Egusi", category: "Food Supplies", unit: "portions", purchaseUnit: "bowls", unitsPerPurchaseUnit: 1 },
    { name: "Assorted Meat", category: "Proteins", unit: "pcs", purchaseUnit: "bowls", unitsPerPurchaseUnit: 20 },
    { name: "Beef Portion", category: "Proteins", unit: "pcs", purchaseUnit: "bowls", unitsPerPurchaseUnit: 20 },
    { name: "Fish Portion", category: "Proteins", unit: "pcs", purchaseUnit: "cartons", unitsPerPurchaseUnit: 10 },
    
    // Exact Beers
    { name: "Trophy Beer", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Small Smirnoff Ice", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Big Smirnoff Ice", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 12 },
    { name: "Guinness Stout (Big)", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 12 },
    { name: "Guinness Stout (Small)", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Goldberg", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Star Radler", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "William Beer", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Gulder", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "33 Export", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Heineken", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Legend Stout", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Budweiser", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Desperado", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },

    // Exact Spirits
    { name: "Martell V.S", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Martell Blue Swift (V.S.O.P)", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Olmeca Tequila", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Jameson Original", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Jameson Black Barrel", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Campari (Small)", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 12 },
    { name: "Campari (Big)", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Chivas Regal", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Best Whiskey", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Best Cream", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Hennessy V.S", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Hennessy V.S.O.P", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Casamigos Gold Tequila", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Casamigos White Tequila", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Jack Daniel's", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Magic Moment Vodka", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Remy Martin V.S.O.P", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Remy Martin 1738 VS", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Absolute Vodka", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Bacardi Carta Oro", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Bacardi Carta Blanca", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Gordon's Gin", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Origin Bitters (Bottle)", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Origin Bitters (Pet)", category: "Drinks", unit: "bottles", purchaseUnit: "packs", unitsPerPurchaseUnit: 12 },

    // Exact Wines & Champagne
    { name: "Martini Rose", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Andre Rose", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Four Cousins", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "4th Street", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Agor Wine", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Baron Wine", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Moët & Chandon Rosé", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },
    { name: "Belaire Rosé", category: "Drinks", unit: "bottles", purchaseUnit: "cartons", unitsPerPurchaseUnit: 6 },

    // Exact Soft & Energy Drinks
    { name: "Hollandia Yoghurt", category: "Drinks", unit: "packs", purchaseUnit: "cartons", unitsPerPurchaseUnit: 10 },
    { name: "Chivita Active Juice", category: "Drinks", unit: "packs", purchaseUnit: "cartons", unitsPerPurchaseUnit: 10 },
    { name: "5 Alive", category: "Drinks", unit: "packs", purchaseUnit: "cartons", unitsPerPurchaseUnit: 10 },
    { name: "Coca Cola (Pet)", category: "Drinks", unit: "bottles", purchaseUnit: "packs", unitsPerPurchaseUnit: 12 },
    { name: "Malt", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Fayrouz", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24 },
    { name: "Bottled Water (Eva)", category: "Drinks", unit: "bottles", purchaseUnit: "packs", unitsPerPurchaseUnit: 12 },
    { name: "Bottled Water (Nirvana)", category: "Drinks", unit: "bottles", purchaseUnit: "packs", unitsPerPurchaseUnit: 12 },
    { name: "Climax Energy Drink", category: "Drinks", unit: "cans", purchaseUnit: "packs", unitsPerPurchaseUnit: 24 },
    { name: "Red Bull", category: "Drinks", unit: "cans", purchaseUnit: "packs", unitsPerPurchaseUnit: 24 },
    { name: "Monster Energy", category: "Drinks", unit: "cans", purchaseUnit: "packs", unitsPerPurchaseUnit: 24 },
    { name: "Power Horse", category: "Drinks", unit: "cans", purchaseUnit: "packs", unitsPerPurchaseUnit: 24 },
    { name: "Black Bullet", category: "Drinks", unit: "cans", purchaseUnit: "packs", unitsPerPurchaseUnit: 24 },
  ];

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { sku: `RAW-${item.name.toUpperCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        name: item.name,
        sku: `RAW-${item.name.toUpperCase().replace(/\s+/g, '-')}`,
        category: item.category,
        unit: item.unit,
        purchaseUnit: item.purchaseUnit,
        unitsPerPurchaseUnit: item.unitsPerPurchaseUnit,
        costPrice: 0,
        sellingPrice: 0,
        mainStoreCount: 0,
        frontStoreCount: 0,
        lowStockAlert: 5,
        available: true
      }
    })
  }

  console.log("Inventory items seeded successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
