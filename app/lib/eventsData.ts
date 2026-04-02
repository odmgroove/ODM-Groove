// ─────────────────────────────────────────────────────────────────────────────
//  ODM Groove — Events Data
//  To add a new event, just add a new object to the EVENTS array below.
//  Copy the existing template and fill in the details.
// ─────────────────────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  date: string;           // ISO string: "2026-05-16T17:00:00"
  endTime: string;        // display string: "Till Dawn"
  venue: string;
  category: "pool-party" | "live-music" | "comedy" | "club-night" | "special" | "corporate";
  status: "upcoming" | "live" | "sold-out" | "past";
  featured: boolean;      // shows in hero/featured slot
  ticketPrices: { label: string; price: number }[];
  contactNumbers: string[];
  hashtags: string[];
  whatsappNumber: string; // digits only, e.g. "2347061514120"
  image: string;          // card thumbnail — path from public folder
  posterImage?: string;   // full event flyer/poster — shown large on event detail page
  accentColor: string;    // CSS color for the event card accent
  artists?: string[];     // Optional: performing artists / DJs
  ageLimit?: number;      // Optional: e.g. 18
  extras?: string[];      // Optional: extra features e.g. "Water guns on sale"
}

// ─────────────────────────────────────────────────────────────────────────────
//  ↓↓↓  ADD / EDIT EVENTS HERE  ↓↓↓
// ─────────────────────────────────────────────────────────────────────────────

export const EVENTS: Event[] = [
  {
    id: "get-wet-pool-party-2026",
    title: "Get Wet",
    subtitle: "Water Splash Pool Party",
    description: "One night. One pool. One unforgettable vibe.",
    longDescription:
      "Immerse yourself in a grooving environment, crystal-clear waters, and an atmosphere unlike anything this season has offered. Whether you're splashing in the pool, vibing to the hottest Afrobeats and Amapiano sets, or locking in a private table for your crew — the Get Wet Water Splash Pool Party is built for those who play hard. Water guns will be on sale at the venue, so come ready for battle. Maximum security is guaranteed throughout the night.",
    date: "2026-05-16T17:00:00",
    endTime: "Till Dawn",
    venue: "Shonekan Street, Olaoparun, After Aboki-Ifa Villa, Ijoko · Ogba-Ayo · Ogun State",
    category: "pool-party",
    status: "upcoming",
    featured: true,
    ticketPrices: [
      { label: "Guys", price: 5000 },
      { label: "Girls", price: 3000 },
    ],
    contactNumbers: ["07061514120", "09049180725"],
    hashtags: ["#PoolParty", "#VDJTiko", "#ODMGroove", "#GetWet", "#WaterSplash", "#TropicalVibes"],
    whatsappNumber: "2347061514120",
    image: "/events/pool-party-2026.jpeg",
    posterImage: "/events/pool-party-2026.jpeg", // Temporarily pointing to the same image since the -poster version is missing
    accentColor: "#00b4d8",
    artists: ["VDJ Tiko", "ODM Groove"],
    ageLimit: 18,
    extras: ["Water guns available for sale at venue", "Maximum security guaranteed", "Room & table reservations available"],
  },

  // ── TEMPLATE — copy and fill in for your next event ──────────────────────
  // {
  //   id: "event-unique-id",
  //   title: "Event Title",
  //   subtitle: "Event Tagline",
  //   description: "Short one-liner shown on cards",
  //   longDescription: "Full description for the event detail page",
  //   date: "2026-06-20T20:00:00",
  //   endTime: "Till Dawn",
  //   venue: "ODM Groove Hotel, Ijoko, Ogun State",
  //   category: "club-night",  // pool-party | live-music | comedy | club-night | special | corporate
  //   status: "upcoming",      // upcoming | live | sold-out | past
  //   featured: false,
  //   ticketPrices: [
  //     { label: "Regular", price: 5000 },
  //     { label: "VIP", price: 15000 },
  //   ],
  //   contactNumbers: ["07061514120", "09049180725"],
  //   hashtags: ["#ODMGroove"],
  //   whatsappNumber: "2347061514120",
  //   image: "/events/your-event-image.jpg",
  //   accentColor: "#c8a84b",
  //   artists: ["Artist Name"],
  //   ageLimit: 18,
  //   extras: ["Free drink on entry"],
  // },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Helper functions
// ─────────────────────────────────────────────────────────────────────────────

export function getUpcomingEvents(): Event[] {
  return EVENTS.filter((e) => e.status === "upcoming" || e.status === "live");
}

export function getFeaturedEvent(): Event | undefined {
  return EVENTS.find((e) => e.featured && (e.status === "upcoming" || e.status === "live"));
}

export function getPastEvents(): Event[] {
  return EVENTS.filter((e) => e.status === "past");
}

export function getEventById(id: string): Event | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function formatEventDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatEventTime(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function getCategoryLabel(cat: Event["category"]): string {
  const map: Record<Event["category"], string> = {
    "pool-party": "Pool Party",
    "live-music": "Live Music",
    "comedy": "Comedy Night",
    "club-night": "Club Night",
    "special": "Special Event",
    "corporate": "Corporate",
  };
  return map[cat] ?? cat;
}
