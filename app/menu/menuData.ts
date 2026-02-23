export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  description?: string;
  emoji?: string;
  tag?: "popular" | "new" | "vip";
};

export type MenuCategory = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  heroImage?: string;
  gradient: string;
};

export const menuCategories: MenuCategory[] = [
  {
    id: "food",
    label: "Kitchen",
    emoji: "🍽️",
    description: "Freshly prepared Nigerian & continental cuisine",
    heroImage: "/menu-food-hero.png",
    gradient: "from-amber-900/60 to-orange-900/60",
  },
  {
    id: "beers",
    label: "Beers & Stout",
    emoji: "🍺",
    description: "Chilled lagers, stouts & radlers",
    heroImage: "/menu-bar-hero.png",
    gradient: "from-yellow-900/60 to-amber-900/60",
  },
  {
    id: "spirits",
    label: "Spirits & Cognac",
    emoji: "🥃",
    description: "Premium whiskies, cognacs, rums & vodkas",
    heroImage: "/menu-bar-hero.png",
    gradient: "from-stone-900/60 to-zinc-800/60",
  },
  {
    id: "wines",
    label: "Wines & Champagne",
    emoji: "🍷",
    description: "Fine wines, rosés & sparkling champagnes",
    heroImage: "/menu-bar-hero.png",
    gradient: "from-rose-900/60 to-pink-900/60",
  },
  {
    id: "shots",
    label: "Shots",
    emoji: "🥂",
    description: "Single spirit shots served with lime",
    heroImage: "/menu-bar-hero.png",
    gradient: "from-indigo-900/60 to-purple-900/60",
  },
  {
    id: "softdrinks",
    label: "Soft Drinks",
    emoji: "🧃",
    description: "Juices, sodas, water & energy drinks",
    heroImage: "/menu-bar-hero.png",
    gradient: "from-teal-900/60 to-cyan-900/60",
  },
  {
    id: "shisha",
    label: "Shisha",
    emoji: "💨",
    description: "Premium hookah with multiple flavours",
    heroImage: "/menu-shisha-hero.png",
    gradient: "from-purple-900/60 to-fuchsia-900/60",
  },
  {
    id: "swimming",
    label: "Swimming Pool",
    emoji: "🏊",
    description: "Relax & unwind at our beautiful pool",
    gradient: "from-blue-900/60 to-cyan-800/60",
  },
  {
    id: "snooker",
    label: "Snooker",
    emoji: "🎱",
    description: "Professional snooker tables — charged per coin",
    gradient: "from-green-900/60 to-emerald-900/60",
  },
  {
    id: "club",
    label: "Club & Rooftop",
    emoji: "🎶",
    description: "Nightclub & rooftop entertainment",
    gradient: "from-violet-900/60 to-purple-900/60",
  },
  {
    id: "vip",
    label: "VIP Section",
    emoji: "👑",
    description: "Exclusive VIP pricing & bottle service",
    gradient: "from-yellow-900/60 to-amber-800/60",
  },
];

export const menuItems: MenuItem[] = [
  // ─── FOOD: Breakfast ────────────────────────────────────────────────────────
  { id: "f1", name: "Boiled Yam & Egg", price: 5500, category: "food", subcategory: "Breakfast", emoji: "🍳", description: "Includes tea, coffee or bottled water" },
  { id: "f2", name: "Boiled Plantain & Egg", price: 5500, category: "food", subcategory: "Breakfast", emoji: "🍌", description: "Includes tea, coffee or bottled water" },
  { id: "f3", name: "Fried Plantain & Egg", price: 5500, category: "food", subcategory: "Breakfast", emoji: "🍳", description: "Includes tea, coffee or bottled water" },
  { id: "f4", name: "Bread & Fried Eggs", price: 5500, category: "food", subcategory: "Breakfast", emoji: "🍞", description: "Includes tea, coffee or bottled water" },
  { id: "f5", name: "Toast Bread / Sandwich", price: 6500, category: "food", subcategory: "Breakfast", emoji: "🥪", description: "Includes tea, coffee or bottled water" },

  // ─── FOOD: Rice & Pasta ─────────────────────────────────────────────────────
  { id: "f6", name: "Jollof Rice & Turkey", price: 8500, category: "food", subcategory: "Rice & Pasta", emoji: "🍚", tag: "popular" },
  { id: "f7", name: "Jollof Rice & Chicken", price: 8500, category: "food", subcategory: "Rice & Pasta", emoji: "🍚", tag: "popular" },
  { id: "f8", name: "Fried Rice & Turkey", price: 8500, category: "food", subcategory: "Rice & Pasta", emoji: "🍛" },
  { id: "f9", name: "Fried Rice & Chicken", price: 8500, category: "food", subcategory: "Rice & Pasta", emoji: "🍛" },
  { id: "f10", name: "Spaghetti & Turkey", price: 7500, category: "food", subcategory: "Rice & Pasta", emoji: "🍝" },
  { id: "f11", name: "Spaghetti & Chicken", price: 7500, category: "food", subcategory: "Rice & Pasta", emoji: "🍝" },
  { id: "f12", name: "Indomie & Egg", price: 3500, category: "food", subcategory: "Rice & Pasta", emoji: "🍜" },
  { id: "f13", name: "Indomie & Chicken", price: 7500, category: "food", subcategory: "Rice & Pasta", emoji: "🍜" },
  { id: "f14", name: "Indomie & Turkey", price: 7500, category: "food", subcategory: "Rice & Pasta", emoji: "🍜" },

  // ─── FOOD: Swallow ──────────────────────────────────────────────────────────
  { id: "f15", name: "Swallow Combo (Poundo/Eba/Semovita/Wheat + Soup + Protein)", price: 9000, category: "food", subcategory: "Swallow", emoji: "🫕", description: "Choice of: Egusi, Efo Riro or Ogbono Soup — with Chicken, Turkey or Fish", tag: "popular" },

  // ─── FOOD: Appetizers ───────────────────────────────────────────────────────
  { id: "f16", name: "Peppered Beef", price: 2000, category: "food", subcategory: "Appetizers", emoji: "🥩" },
  { id: "f17", name: "Peppered Chicken", price: 5000, category: "food", subcategory: "Appetizers", emoji: "🍗" },
  { id: "f18", name: "Peppered Turkey", price: 5000, category: "food", subcategory: "Appetizers", emoji: "🍗" },

  // ─── FOOD: Pepper Soup ──────────────────────────────────────────────────────
  { id: "f19", name: "Assorted Meat Pepper Soup", price: 2000, category: "food", subcategory: "Pepper Soup", emoji: "🥘" },
  { id: "f20", name: "Chicken Pepper Soup", price: 5000, category: "food", subcategory: "Pepper Soup", emoji: "🥘" },
  { id: "f21", name: "Turkey Pepper Soup", price: 5000, category: "food", subcategory: "Pepper Soup", emoji: "🥘" },
  { id: "f22", name: "Goat Meat Pepper Soup", price: 7000, category: "food", subcategory: "Pepper Soup", emoji: "🥘", tag: "popular" },

  // ─── BEERS ──────────────────────────────────────────────────────────────────
  { id: "b1", name: "Trophy Beer", price: 1500, category: "beers", emoji: "🍺" },
  { id: "b2", name: "Small Smirnoff Ice", price: 1500, category: "beers", emoji: "🍺" },
  { id: "b3", name: "Big Smirnoff Ice", price: 2500, category: "beers", emoji: "🍺", tag: "popular" },
  { id: "b4", name: "Guinness Stout (Big)", price: 2500, category: "beers", emoji: "🍺" },
  { id: "b5", name: "Guinness Stout (Small)", price: 1500, category: "beers", emoji: "🍺" },
  { id: "b6", name: "Goldberg", price: 1500, category: "beers", emoji: "🍺" },
  { id: "b7", name: "Star Radler", price: 1300, category: "beers", emoji: "🍺" },
  { id: "b8", name: "William Beer", price: 1500, category: "beers", emoji: "🍺" },
  { id: "b9", name: "Gulder", price: 2000, category: "beers", emoji: "🍺" },
  { id: "b10", name: "33 Export", price: 1500, category: "beers", emoji: "🍺" },
  { id: "b11", name: "Heineken", price: 2000, category: "beers", emoji: "🍺", tag: "popular" },
  { id: "b12", name: "Legend Stout", price: 2000, category: "beers", emoji: "🍺" },
  { id: "b13", name: "Budweiser", price: 2000, category: "beers", emoji: "🍺" },
  { id: "b14", name: "Desperado", price: 1500, category: "beers", emoji: "🍺" },

  // ─── SPIRITS & COGNAC ───────────────────────────────────────────────────────
  { id: "s1", name: "Martell V.S", price: 90000, category: "spirits", emoji: "🥃", tag: "popular" },
  { id: "s2", name: "Martell Blue Swift (V.S.O.P)", price: 130000, category: "spirits", emoji: "🥃" },
  { id: "s3", name: "Olmeca Tequila", price: 45000, category: "spirits", emoji: "🥃" },
  { id: "s4", name: "Jameson Original", price: 40000, category: "spirits", emoji: "🥃", tag: "popular" },
  { id: "s5", name: "Jameson Black Barrel", price: 65000, category: "spirits", emoji: "🥃" },
  { id: "s6", name: "Campari (Small)", price: 13500, category: "spirits", emoji: "🥃" },
  { id: "s7", name: "Campari (Big)", price: 30000, category: "spirits", emoji: "🥃" },
  { id: "s8", name: "Chivas Regal", price: 35000, category: "spirits", emoji: "🥃" },
  { id: "s9", name: "Best Whiskey", price: 12000, category: "spirits", emoji: "🥃" },
  { id: "s10", name: "Best Cream", price: 15000, category: "spirits", emoji: "🥃" },
  { id: "s11", name: "Hennessy V.S", price: 80000, category: "spirits", emoji: "🥃", tag: "popular" },
  { id: "s12", name: "Hennessy V.S.O.P", price: 130000, category: "spirits", emoji: "🥃" },
  { id: "s13", name: "Casamigos Gold Tequila", price: 220000, category: "spirits", emoji: "🥃" },
  { id: "s14", name: "Casamigos White Tequila", price: 200000, category: "spirits", emoji: "🥃" },
  { id: "s15", name: "Jack Daniel's", price: 40000, category: "spirits", emoji: "🥃", tag: "popular" },
  { id: "s16", name: "Magic Moment Vodka", price: 15000, category: "spirits", emoji: "🥃" },
  { id: "s17", name: "Remy Martin V.S.O.P", price: 100000, category: "spirits", emoji: "🥃" },
  { id: "s18", name: "Remy Martin 1738 VS", price: 150000, category: "spirits", emoji: "🥃" },
  { id: "s19", name: "Absolute Vodka", price: 30000, category: "spirits", emoji: "🥃" },
  { id: "s20", name: "Bacardi Carta Oro (75cl)", price: 35000, category: "spirits", emoji: "🥃" },
  { id: "s21", name: "Bacardi Carta Blanca (75cl)", price: 30000, category: "spirits", emoji: "🥃" },
  { id: "s22", name: "Smirnoff Ice Vodka", price: 12000, category: "spirits", emoji: "🥃" },
  { id: "s23", name: "Gordon's Gin", price: 12500, category: "spirits", emoji: "🥃" },
  { id: "s24", name: "Origin Bitters (Bottle)", price: 8000, category: "spirits", emoji: "🥃" },
  { id: "s25", name: "Origin Bitters (Pet)", price: 4000, category: "spirits", emoji: "🥃" },

  // ─── WINES & CHAMPAGNE ──────────────────────────────────────────────────────
  { id: "w1", name: "Martini Rose", price: 25000, category: "wines", emoji: "🍷", tag: "popular" },
  { id: "w2", name: "Andre Rose", price: 20000, category: "wines", emoji: "🍷" },
  { id: "w3", name: "Four Cousins", price: 18000, category: "wines", emoji: "🍷" },
  { id: "w4", name: "4th Street", price: 15000, category: "wines", emoji: "🍷" },
  { id: "w5", name: "Agor Wine", price: 15000, category: "wines", emoji: "🍷" },
  { id: "w6", name: "Baron Wine", price: 12000, category: "wines", emoji: "🍷" },
  { id: "w7", name: "Moët & Chandon Rosé", price: 160000, category: "wines", emoji: "🥂", subcategory: "Champagne", tag: "popular" },
  { id: "w8", name: "Belaire Rosé", price: 95000, category: "wines", emoji: "🥂", subcategory: "Champagne" },

  // ─── SHOTS ──────────────────────────────────────────────────────────────────
  { id: "sh1", name: "William Lawson Shot", price: 2500, category: "shots", emoji: "🥂" },
  { id: "sh2", name: "Bacardi Carta Blanca Shot", price: 3000, category: "shots", emoji: "🥂" },
  { id: "sh3", name: "Olmeca Tequila Shot", price: 3500, category: "shots", emoji: "🥂" },

  // ─── SOFT DRINKS ────────────────────────────────────────────────────────────
  { id: "sd1", name: "Hollandia Yoghurt", price: 3000, category: "softdrinks", emoji: "🥛" },
  { id: "sd2", name: "Chivita Active Juice", price: 3000, category: "softdrinks", emoji: "🧃" },
  { id: "sd3", name: "5 Alive", price: 2000, category: "softdrinks", emoji: "🧃" },
  { id: "sd4", name: "Coca Cola (Pet)", price: 1000, category: "softdrinks", emoji: "🥤" },
  { id: "sd5", name: "Malt", price: 1000, category: "softdrinks", emoji: "🥤" },
  { id: "sd6", name: "Fayrouz", price: 1000, category: "softdrinks", emoji: "🥤" },
  { id: "sd7", name: "Bottled Water (Eva)", price: 1000, category: "softdrinks", emoji: "💧" },
  { id: "sd8", name: "Bottled Water (Nirvana)", price: 500, category: "softdrinks", emoji: "💧" },
  { id: "sd9", name: "Climax Energy Drink", price: 1500, category: "softdrinks", emoji: "⚡", subcategory: "Energy Drinks" },
  { id: "sd10", name: "Red Bull", price: 3000, category: "softdrinks", emoji: "⚡", subcategory: "Energy Drinks", tag: "popular" },
  { id: "sd11", name: "Monster Energy", price: 3000, category: "softdrinks", emoji: "⚡", subcategory: "Energy Drinks" },
  { id: "sd12", name: "Power Horse", price: 3000, category: "softdrinks", emoji: "⚡", subcategory: "Energy Drinks" },
  { id: "sd13", name: "Black Bullet", price: 3500, category: "softdrinks", emoji: "⚡", subcategory: "Energy Drinks" },

  // ─── SHISHA ─────────────────────────────────────────────────────────────────
  { id: "sh4", name: "Shisha (1 Hose)", price: 5000, category: "shisha", emoji: "💨", description: "Single hose hookah with your choice of flavour" },
  { id: "sh5", name: "Shisha (2 Hoses)", price: 8000, category: "shisha", emoji: "💨", description: "Double hose hookah — great for sharing", tag: "popular" },

  // ─── SWIMMING POOL ──────────────────────────────────────────────────────────
  { id: "sw1", name: "Swimming Pool – Adult (1 Person)", price: 3000, category: "swimming", emoji: "🏊", description: "Full day access to the swimming pool" },
  { id: "sw2", name: "Swimming Pool – 4 Adults Package", price: 10000, category: "swimming", emoji: "🏊", description: "4 adults — great savings!", tag: "popular" },
  { id: "sw3", name: "Swimming Pool – Child (1 Child)", price: 2000, category: "swimming", emoji: "👶", description: "Full day access for children" },
  { id: "sw4", name: "Swimming Pool – 4 Children Package", price: 6000, category: "swimming", emoji: "👶", description: "4 children package" },

  // ─── SNOOKER ────────────────────────────────────────────────────────────────
  { id: "sn1", name: "Snooker – Per Coin", price: 1000, category: "snooker", emoji: "🎱", description: "One coin = one game on our professional tables" },

  // ─── CLUB & ROOFTOP ─────────────────────────────────────────────────────────
  { id: "cl1", name: "Club Entry / Rooftop Access", price: 0, category: "club", emoji: "🎶", description: "Enquire at the front desk for current event pricing" },

  // ─── VIP SECTION ────────────────────────────────────────────────────────────
  { id: "v1", name: "Trophy Beer (VIP)", price: 2500, category: "vip", emoji: "👑" },
  { id: "v2", name: "Small Smirnoff Ice (VIP)", price: 2500, category: "vip", emoji: "👑" },
  { id: "v3", name: "Big Smirnoff Ice (VIP)", price: 3500, category: "vip", emoji: "👑" },
  { id: "v4", name: "Guinness Stout Big (VIP)", price: 3500, category: "vip", emoji: "👑" },
  { id: "v5", name: "Guinness Stout Small (VIP)", price: 2500, category: "vip", emoji: "👑" },
  { id: "v6", name: "Goldberg (VIP)", price: 2500, category: "vip", emoji: "👑" },
  { id: "v7", name: "Star Radler (VIP)", price: 2300, category: "vip", emoji: "👑" },
  { id: "v8", name: "William Beer (VIP)", price: 2500, category: "vip", emoji: "👑" },
  { id: "v9", name: "Gulder (VIP)", price: 3000, category: "vip", emoji: "👑" },
  { id: "v10", name: "33 Export (VIP)", price: 2500, category: "vip", emoji: "👑" },
  { id: "v11", name: "Heineken (VIP)", price: 3000, category: "vip", emoji: "👑" },
  { id: "v12", name: "Legend Stout (VIP)", price: 3000, category: "vip", emoji: "👑" },
  { id: "v13", name: "Budweiser (VIP)", price: 3000, category: "vip", emoji: "👑" },
  { id: "v14", name: "Desperado (VIP)", price: 2500, category: "vip", emoji: "👑" },
  { id: "v15", name: "Red Label (VIP)", price: 40000, category: "vip", emoji: "👑", tag: "popular" },
  { id: "v16", name: "Baileys Original (VIP)", price: 25000, category: "vip", emoji: "👑" },
  { id: "v17", name: "William Lawson (VIP)", price: 25000, category: "vip", emoji: "👑" },
  { id: "v18", name: "Sierra Tequila (VIP)", price: 22000, category: "vip", emoji: "👑" },
  { id: "v19", name: "Ciroc Vodka (VIP)", price: 55000, category: "vip", emoji: "👑" },
  { id: "v20", name: "William Lawson Shot (VIP)", price: 3500, category: "vip", emoji: "👑" },
  { id: "v21", name: "Bacardi Shot (VIP)", price: 3500, category: "vip", emoji: "👑" },
  { id: "v22", name: "Olmeca Tequila Shot (VIP)", price: 4500, category: "vip", emoji: "👑" },
];
