import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Check,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  Wifi,
  Coffee,
  Tv,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { prisma } from "../lib/prisma";
import { BUSINESS_INFO, SITE_URL, getRoomsOfferJsonLd } from "../lib/seo";
import { FALLBACK_ROOMS } from "../lib/fallbackData";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hotel & Lodging in Ijoko & Ifo, Ogun",
  description:
    "Book affordable rooms from ₦30,000/night at ODM Groove Hotel in Ijoko Ogbayo, Ogba-Ayo & Ifo, Ogun State. Free breakfast, WiFi, Netflix, DSTV & 24/7 security.",
  keywords: [
    "hotel in Ijoko",
    "hotel in Ogba-Ayo",
    "hotel in Ifo Ogun State",
    "lodge near Aboki-Ifa Ijoko",
    "affordable hotel near Lagos Ogun border",
    "ODM Groove Hotel rooms",
  ],
  alternates: {
    canonical: `${SITE_URL}/hotel-ijoko-ifo`,
  },
  openGraph: {
    title: "Hotel & Lodging in Ijoko, Ogba-Ayo & Ifo, Ogun State | ODM Groove",
    description:
      "Comfortable Standard & Deluxe rooms from ₦30,000/night in Ijoko Ogbayo, Ifo LGA. Free breakfast, high-speed WiFi, Netflix, DSTV & 24/7 security.",
    url: `${SITE_URL}/hotel-ijoko-ifo`,
    images: [
      {
        url: "/Room/odm-groove-hotel-room-40k-1.jpg",
        width: 1200,
        height: 630,
        alt: "ODM Groove Hotel room in Ijoko Ogbayo, Ifo, Ogun State",
      },
    ],
  },
};

const TIER_IMAGES: Record<string, string> = {
  "30k": "/Room/odm-groove-hotel-room-30k-1.jpg",
  "40k": "/Room/odm-groove-hotel-room-40k-1.jpg",
  "50k": "/Room/odm-groove-hotel-room-50k-1.jpg",
};

export default async function HotelIjokoIfoPage() {
  let rooms: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string;
    capacity: number;
  }[] = [];

  try {
    rooms = await prisma.room.findMany({
      where: { available: true },
      orderBy: { price: "asc" },
    });
  } catch (err) {
    console.error("Hotel page room fetch fallback:", err);
  }

  if (rooms.length === 0) rooms = FALLBACK_ROOMS;

  const offersJsonLd = getRoomsOfferJsonLd(rooms);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hotel & Lodging in Ijoko & Ifo",
        item: `${SITE_URL}/hotel-ijoko-ifo`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--black)] text-[var(--off-white)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {offersJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
        />
      )}

      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[var(--gold)] text-xs tracking-[0.25em] uppercase font-medium mb-3">
                Ijoko Ogbayo · Ogba-Ayo · Aboki-Ifa · Ifo LGA
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">
                Boutique Hotel &amp; Lodging in{" "}
                <span className="gradient-text italic">Ijoko &amp; Ifo, Ogun State</span>
              </h1>
              <p className="text-[var(--warm-gray)] text-base md:text-lg leading-relaxed mb-6">
                Whether you are visiting Ijoko, Ogba-Ayo, Ifo, Sango Ota, or
                Agbado for business, a weekend staycation, or an event,{" "}
                <strong className="text-[var(--off-white)]">ODM Groove Hotel</strong>{" "}
                offers quiet, air-conditioned rooms starting from{" "}
                <strong className="text-[var(--gold)]">₦30,000/night</strong> —
                complete with free daily breakfast, fast WiFi, Netflix, DSTV,
                and 24/7 security.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href={`https://wa.me/2347061514120?text=${encodeURIComponent(
                    "Hello ODM Groove, I would like to book a room."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Book a Room on WhatsApp
                </a>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  <Phone size={16} />
                  Call {BUSINESS_INFO.phoneDisplay}
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[var(--off-white)]/80">
                <div className="glass-card p-3 flex items-center gap-2">
                  <Coffee size={15} className="text-[var(--gold)] shrink-0" />
                  <span>Free Breakfast</span>
                </div>
                <div className="glass-card p-3 flex items-center gap-2">
                  <Wifi size={15} className="text-[var(--gold)] shrink-0" />
                  <span>High-Speed WiFi</span>
                </div>
                <div className="glass-card p-3 flex items-center gap-2">
                  <Tv size={15} className="text-[var(--gold)] shrink-0" />
                  <span>Netflix &amp; DSTV</span>
                </div>
                <div className="glass-card p-3 flex items-center gap-2">
                  <Shield size={15} className="text-[var(--gold)] shrink-0" />
                  <span>24/7 Security</span>
                </div>
              </div>
            </div>

            <div className="relative h-[340px] md:h-[440px] rounded-sm overflow-hidden border border-[var(--dark-border)]">
              <Image
                src="/Room/odm-groove-hotel-room-50k-1.jpg"
                alt="Deluxe executive room at ODM Groove Hotel in Ijoko Ogbayo, Ifo, Ogun State"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 mb-20">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Available Rooms &amp; <span className="gradient-text italic">Nightly Rates</span>
          </h2>
          <p className="text-[var(--warm-gray)] mb-10 max-w-2xl">
            10% discount applies for stays of 3 nights or more. Check-in starts at 2:00 PM; check-out is 12:00 PM.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const tier =
                room.price <= 30000 ? "30k" : room.price <= 40000 ? "40k" : "50k";
              const features = room.features
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean)
                .slice(0, 5);

              return (
                <article
                  key={room.id}
                  className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm overflow-hidden flex flex-col"
                >
                  <div className="relative h-52 w-full">
                    <Image
                      src={TIER_IMAGES[tier]}
                      alt={`${room.name} at ODM Groove Hotel, Ijoko Ogbayo, Ifo`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-display text-2xl font-bold text-[var(--off-white)]">
                        {room.name}
                      </h3>
                      <span className="text-[var(--gold)] font-bold text-lg whitespace-nowrap">
                        ₦{room.price.toLocaleString()}
                        <span className="text-xs text-[var(--warm-gray)] font-normal">
                          /night
                        </span>
                      </span>
                    </div>
                    <p className="text-[var(--warm-gray)] text-sm leading-relaxed mb-4">
                      {room.description}
                    </p>
                    <ul className="space-y-1.5 mb-6 text-xs text-[var(--off-white)]/80">
                      {features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2">
                          <Check size={12} className="text-[var(--gold)] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`https://wa.me/2347061514120?text=${encodeURIComponent(
                        `Hello ODM Groove, I want to book the ${room.name} (₦${room.price.toLocaleString()}/night).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold w-full text-center mt-auto inline-flex items-center justify-center gap-2"
                    >
                      <BedDouble size={15} />
                      Reserve {room.name}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Directions & Cross-links */}
        <section className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="glass-card p-8 rounded-sm border border-[var(--dark-border)] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                Easy Access Across the Ijoko, Ogba-Ayo &amp; Ifo Axis
              </h2>
              <p className="text-[var(--warm-gray)] text-sm leading-relaxed mb-4">
                Located at{" "}
                <strong className="text-[var(--off-white)]">
                  Shonekan Street, Ola-Oparun, After Aboki-Ifa Villa, Ijoko Ogbayo, Ifo LGA, Ogun State
                </strong>
                , we are minutes from Aboki-Ifa, Ogba-Ayo, Ifo, Agbado, and Sango Ota — with ample free on-site parking.
              </p>
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--gold)] text-sm font-semibold hover:underline"
              >
                <MapPin size={16} />
                Open in Google Maps
              </a>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <Link
                href="/event-hall-ijoko-ifo"
                className="p-4 bg-[var(--dark)] border border-[var(--dark-border)] hover:border-[var(--gold)]/50 rounded-sm flex items-center justify-between transition-colors"
              >
                <span>Need a 200+ Guest Event Hall in Ijoko &amp; Ifo?</span>
                <ArrowRight size={16} className="text-[var(--gold)]" />
              </Link>
              <Link
                href="/nightlife-pool-ijoko-ifo"
                className="p-4 bg-[var(--dark)] border border-[var(--dark-border)] hover:border-[var(--gold)]/50 rounded-sm flex items-center justify-between transition-colors"
              >
                <span>Swimming Pool, Nightclub &amp; Rooftop Bar</span>
                <ArrowRight size={16} className="text-[var(--gold)]" />
              </Link>
              <Link
                href="/menu"
                className="p-4 bg-[var(--dark)] border border-[var(--dark-border)] hover:border-[var(--gold)]/50 rounded-sm flex items-center justify-between transition-colors"
              >
                <span>Browse Food, Drinks &amp; VIP Bottle Menu</span>
                <ArrowRight size={16} className="text-[var(--gold)]" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

