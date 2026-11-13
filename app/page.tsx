import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import RoomsSection from "./components/RoomsSection";
import AmenitiesSection from "./components/AmenitiesSection";
import EventsSection from "./components/EventsSection";
import GallerySection from "./components/GallerySection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import BookingCTASection from "./components/BookingCTASection";
import Footer from "./components/Footer";
import HomeClientOverlays from "./components/HomeClientOverlays";
import { prisma } from "./lib/prisma";
import { getRoomsOfferJsonLd } from "./lib/seo";
import { FALLBACK_ROOMS, FALLBACK_FAQS } from "./lib/fallbackData";

export const revalidate = 60;

export default async function Home() {
  let rooms: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string;
    image: string | null;
    capacity: number;
    available: boolean;
  }[] = [];

  let faqs: {
    id: string;
    question: string;
    answer: string;
    order: number;
  }[] = [];

  let testimonials: {
    id: string;
    name: string;
    role: string | null;
    content: string;
    rating: number;
    visible: boolean;
    images: string | null;
  }[] = [];

  let events: {
    id: string;
    title: string;
    subtitle: string | null;
    description: string;
    longDescription: string | null;
    date: string;
    endTime: string;
    venue: string;
    category: string;
    status: string;
    featured: boolean;
    ticketPrices: string;
    contactNumbers: string;
    hashtags: string;
    whatsappNumber: string;
    image: string | null;
    posterImage: string | null;
    accentColor: string;
    artists: string | null;
    ageLimit: number | null;
    extras: string | null;
  }[] = [];

  try {
    const [dbRooms, dbFaqs, dbTestimonials, dbEvents] = await Promise.all([
      prisma.room.findMany({
        where: { available: true },
        orderBy: { price: "asc" },
      }),
      prisma.fAQ.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { visible: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.findMany({
        orderBy: { date: "asc" },
      }),
    ]);

    rooms = dbRooms;
    faqs = dbFaqs;
    testimonials = dbTestimonials;
    events = dbEvents.map((e) => ({
      ...e,
      date: e.date.toISOString(),
    }));
  } catch (err) {
    console.error("Landing page SSR data fetch fallback:", err);
  }

  if (rooms.length === 0) rooms = FALLBACK_ROOMS;
  if (faqs.length === 0) faqs = FALLBACK_FAQS;

  const roomsOfferJsonLd = getRoomsOfferJsonLd(rooms);

  return (
    <main className="min-h-screen selection:bg-[var(--gold)] selection:text-[var(--black)]">
      {roomsOfferJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(roomsOfferJsonLd) }}
        />
      )}

      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <HeroSection />
      <AboutSection />
      <RoomsSection initialRooms={rooms.length > 0 ? rooms : undefined} />
      <AmenitiesSection />
      <EventsSection initialEvents={events.length > 0 ? events : undefined} />
      <GallerySection />
      <TestimonialsSection
        initialTestimonials={testimonials.length > 0 ? testimonials : undefined}
      />
      <FAQSection initialFaqs={faqs.length > 0 ? faqs : undefined} />
      <BookingCTASection />

      {/* Footer */}
      <Footer />

      {/* Client-side interactive modals & chat */}
      <HomeClientOverlays />
    </main>
  );
}
