import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Waves,
  Music,
  Wine,
  Play,
  MessageCircle,
  MapPin,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BUSINESS_INFO, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: "Swimming Pool, Nightclub & Rooftop Lounge in Ijoko & Ifo, Ogun State",
  description:
    "Looking for a swimming pool, nightclub, rooftop bar, snooker, or fun hangout spot in Ijoko Ogbayo, Ogba-Ayo, Aboki-Ifa & Ifo, Ogun State? Visit ODM Groove for pool parties, VIP bottle service, cocktails & weekend nightlife.",
  keywords: [
    "swimming pool in Ijoko",
    "nightclub in Ijoko Ifo",
    "club in Ogba-Ayo Ogun State",
    "rooftop bar in Ijoko",
    "fun hangout spot in Ifo Ogun State",
    "pool party near Lagos Ogun border",
  ],
  alternates: {
    canonical: `${SITE_URL}/nightlife-pool-ijoko-ifo`,
  },
  openGraph: {
    title: "Swimming Pool, Nightclub & Rooftop Lounge in Ijoko & Ifo | ODM Groove",
    description:
      "Dive into our outdoor swimming pool, enjoy weekend DJ sets at ODM Nightclub, or unwind at the Rooftop & VIP Lounge in Ijoko Ogbayo, Ifo, Ogun State.",
    url: `${SITE_URL}/nightlife-pool-ijoko-ifo`,
    images: [
      {
        url: "/Bar/odm-groove-rooftop-bar-view-1.jpg",
        width: 1200,
        height: 630,
        alt: "ODM Groove Rooftop Bar and VIP Lounge in Ijoko Ogbayo, Ogun State",
      },
    ],
  },
};

export default function NightlifePoolIjokoIfoPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Swimming Pool, Nightclub & Lounge",
        item: `${SITE_URL}/nightlife-pool-ijoko-ifo`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--black)] text-[var(--off-white)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
                Swimming Pool, Nightclub &amp;{" "}
                <span className="gradient-text italic">Rooftop Lounge</span> in Ijoko &amp; Ifo
              </h1>
              <p className="text-[var(--warm-gray)] text-base md:text-lg leading-relaxed mb-6">
                No need to sit in Lagos traffic just to have fun. Right here in{" "}
                <strong className="text-[var(--off-white)]">
                  Ijoko Ogbayo (Ogba-Ayo), near Aboki-Ifa in Ifo, Ogun State
                </strong>
                , ODM Groove brings together a crystal-clear outdoor swimming
                pool, high-energy weekend nightclub, rooftop &amp; VIP bar,
                snooker lounge, and fresh kitchen grills.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/menu"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  <UtensilsCrossed size={16} />
                  View Menu &amp; Order
                </Link>
                <a
                  href={`https://wa.me/2347061514120?text=${encodeURIComponent(
                    "Hello ODM Groove, I would like to reserve a VIP table / ask about pool access."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Reserve a VIP Table
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-sm overflow-hidden border border-[var(--dark-border)]">
                <Image
                  src="/Bar/odm-groove-rooftop-bar-view-1.jpg"
                  alt="ODM Groove Rooftop Bar in Ijoko Ogbayo, Ifo, Ogun State"
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-sm overflow-hidden border border-[var(--dark-border)]">
                <Image
                  src="/Outdoor night view/odm-groove-nightlife-outdoor-1.jpg"
                  alt="ODM Groove outdoor nightlife and party atmosphere in Ijoko"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-sm overflow-hidden border border-[var(--dark-border)] col-span-2">
                <Image
                  src="/Bar/odm-groove-vip-bar-lounge-1.jpg"
                  alt="ODM Groove VIP Bar Lounge in Ijoko Ogbayo, Ogun State"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4 Experiences */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Waves,
                title: "Outdoor Swimming Pool & Pool Parties",
                body: "Relax by the poolside during the day or turn up at our signature pool parties. Deluxe hotel guests enjoy complimentary pool access, and day visitors are welcome.",
              },
              {
                icon: Music,
                title: "ODM Nightclub & Weekend DJs",
                body: "Experience Afrobeats, Amapiano, and club classics on our state-of-the-art sound system with top DJs, bottle service, and 24/7 security.",
              },
              {
                icon: Wine,
                title: "Rooftop Bar & VIP Lounge",
                body: "Enjoy signature cocktails, chilled drinks, shisha, and grilled platters overlooking Ijoko Ogbayo from our open-air rooftop bar or private VIP lounge.",
              },
              {
                icon: Play,
                title: "Snooker & Sports Leisure",
                body: "Challenge friends to a frame of snooker, catch live football matches on big screens, and unwind in a safe, vibrant atmosphere.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-card p-6 md:p-8 rounded-sm border border-[var(--dark-border)]"
              >
                <item.icon size={24} className="text-[var(--gold)] mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">
                  {item.title}
                </h2>
                <p className="text-[var(--warm-gray)] text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-2xl font-bold mb-3">
              Find Us in Ijoko Ogbayo, Ifo LGA
            </h2>
            <p className="text-[var(--warm-gray)] text-sm leading-relaxed mb-4">
              {BUSINESS_INFO.streetAddress}, {BUSINESS_INFO.locality},{" "}
              {BUSINESS_INFO.region}. Safe parking and 24/7 security on-site.
            </p>
            <a
              href={BUSINESS_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--gold)] text-sm font-semibold hover:underline"
            >
              <MapPin size={16} />
              Open Directions in Google Maps
            </a>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <Link
              href="/events"
              className="p-4 bg-[var(--dark)] border border-[var(--dark-border)] hover:border-[var(--gold)]/50 rounded-sm flex items-center justify-between transition-colors"
            >
              <span>Upcoming Pool Parties &amp; Club Nights</span>
              <ArrowRight size={16} className="text-[var(--gold)]" />
            </Link>
            <Link
              href="/hotel-ijoko-ifo"
              className="p-4 bg-[var(--dark)] border border-[var(--dark-border)] hover:border-[var(--gold)]/50 rounded-sm flex items-center justify-between transition-colors"
            >
              <span>Lodge Overnight — Rooms from ₦30,000/night</span>
              <ArrowRight size={16} className="text-[var(--gold)]" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

