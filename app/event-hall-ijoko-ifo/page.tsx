import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Car,
  Music,
  Wine,
  MessageCircle,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BUSINESS_INFO, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: "Event Hall in Ijoko & Ifo, Ogun State",
  description:
    "Book our 200+ capacity event hall in Ijoko Ogbayo, Ogba-Ayo & Ifo, Ogun State for weddings, birthdays & seminars with sound, catering & 24/7 security.",
  keywords: [
    "event hall in Ijoko",
    "event hall in Ifo Ogun State",
    "wedding hall in Ogba-Ayo Ijoko",
    "party venue near Aboki-Ifa",
    "200 capacity event hall Ogun State",
    "ODM Groove Event Hall",
  ],
  alternates: {
    canonical: `${SITE_URL}/event-hall-ijoko-ifo`,
  },
  openGraph: {
    title: "200+ Capacity Event Hall in Ijoko & Ifo, Ogun State | ODM Groove",
    description:
      "Host unforgettable weddings, birthdays, corporate events, and receptions at ODM Groove Event Hall in Ijoko Ogbayo, Ifo LGA, Ogun State.",
    url: `${SITE_URL}/event-hall-ijoko-ifo`,
    images: [
      {
        url: "/Hall/odm-groove-event-hall-interior-view-1.jpg",
        width: 1200,
        height: 630,
        alt: "ODM Groove 200+ capacity event hall interior in Ijoko Ogbayo, Ifo, Ogun State",
      },
    ],
  },
};

export default function EventHallIjokoIfoPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Event Hall in Ijoko & Ifo",
        item: `${SITE_URL}/event-hall-ijoko-ifo`,
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
        <section className="max-w-7xl mx-auto px-5 md:px-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[var(--gold)] text-xs tracking-[0.25em] uppercase font-medium mb-3">
                Ijoko Ogbayo · Ogba-Ayo · Aboki-Ifa · Ifo LGA
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">
                200+ Capacity{" "}
                <span className="gradient-text italic">Event Hall &amp; Party Venue</span>{" "}
                in Ijoko &amp; Ifo
              </h1>
              <p className="text-[var(--warm-gray)] text-base md:text-lg leading-relaxed mb-6">
                Planning a wedding reception, birthday celebration, naming
                ceremony, graduation, or corporate seminar in the{" "}
                <strong className="text-[var(--off-white)]">
                  Ijoko, Ogba-Ayo, Aboki-Ifa, or Ifo
                </strong>{" "}
                axis? ODM Groove&apos;s air-conditioned event hall seats over{" "}
                <strong className="text-[var(--gold)]">200 guests</strong> with
                premium acoustics, on-site catering, secure parking, and hotel
                rooms right on the property for your out-of-town guests.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href={`https://wa.me/2347061514120?text=${encodeURIComponent(
                    "Hello ODM Groove, I would like to inquire about booking the Event Hall."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Inquire on WhatsApp
                </a>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  <Phone size={16} />
                  Call {BUSINESS_INFO.phoneDisplay}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: "200+ Guest Capacity", desc: "Spacious & flexible layout" },
                  { icon: Car, label: "Free On-Site Parking", desc: "24/7 uniformed security" },
                  { icon: Music, label: "Sound & Acoustics", desc: "Ready for DJs & live bands" },
                  { icon: Wine, label: "Catering & Bar", desc: "Full kitchen & bar service" },
                ].map((item) => (
                  <div key={item.label} className="glass-card p-4 rounded-sm flex gap-3">
                    <item.icon size={18} className="text-[var(--gold)] shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-sm font-semibold text-[var(--off-white)]">
                        {item.label}
                      </h2>
                      <p className="text-xs text-[var(--warm-gray)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative h-64 sm:h-80 rounded-sm overflow-hidden border border-[var(--dark-border)] sm:col-span-2">
                <Image
                  src="/Hall/odm-groove-event-hall-interior-view-1.jpg"
                  alt="ODM Groove Event Hall interior setup in Ijoko Ogbayo, Ifo, Ogun State"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-sm overflow-hidden border border-[var(--dark-border)]">
                <Image
                  src="/Hall/odm-groove-event-hall-front-view.jpg"
                  alt="ODM Groove Event Hall exterior entrance"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-sm overflow-hidden border border-[var(--dark-border)]">
                <Image
                  src="/Hall/odm-groove-event-hall-interior-view-2.jpg"
                  alt="ODM Groove Event Hall seating and stage view"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Events We Host */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 mb-16">
          <div className="glass-card p-8 md:p-10 rounded-sm border border-[var(--dark-border)]">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
              Perfect Venue for Every Celebration in Ogun State
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-[var(--off-white)]/85">
              {[
                "Traditional & White Wedding Receptions",
                "Birthday Parties & Milestone Celebrations",
                "Corporate Seminars, Trainings & AGM Meetings",
                "Naming Ceremonies & Thanksgiving Parties",
                "After-Parties with Nightclub & VIP Lounge Access",
                "Community & Association Gatherings in Ifo LGA",
              ].map((ev) => (
                <div key={ev} className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-[var(--gold)] shrink-0 mt-0.5" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location & Links */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-2xl font-bold mb-3">
              Visit &amp; Inspect the Hall Today
            </h2>
            <p className="text-[var(--warm-gray)] text-sm leading-relaxed mb-4">
              Find us at{" "}
              <strong className="text-[var(--off-white)]">
                Shonekan Street, Ola-Oparun, After Aboki-Ifa Villa, Ijoko Ogbayo, Ifo LGA, Ogun State
              </strong>
              . Walk-ins for hall inspections are welcome daily.
            </p>
            <a
              href={BUSINESS_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--gold)] text-sm font-semibold hover:underline"
            >
              <MapPin size={16} />
              Get Directions on Google Maps
            </a>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <Link
              href="/hotel-ijoko-ifo"
              className="p-4 bg-[var(--dark)] border border-[var(--dark-border)] hover:border-[var(--gold)]/50 rounded-sm flex items-center justify-between transition-colors"
            >
              <span>Book Hotel Rooms for Your Event Guests</span>
              <ArrowRight size={16} className="text-[var(--gold)]" />
            </Link>
            <Link
              href="/events"
              className="p-4 bg-[var(--dark)] border border-[var(--dark-border)] hover:border-[var(--gold)]/50 rounded-sm flex items-center justify-between transition-colors"
            >
              <span>See Upcoming Parties &amp; Live Events</span>
              <ArrowRight size={16} className="text-[var(--gold)]" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

