import { EVENTS, formatEventDate, getCategoryLabel, type Event } from "../../lib/eventsData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EventDetailClient from "./EventDetailClient";

export async function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const event = EVENTS.find((e) => e.id === resolvedParams.id);
  if (!event) return {};
  const title = `${event.title} — ${event.subtitle} | ODM Groove`;
  const description = `${event.description} ${formatEventDate(event.date)} at ODM Groove, Ijoko, Ogun State. Tickets: ${event.ticketPrices.map((t) => `${t.label} ₦${t.price.toLocaleString()}`).join(", ")}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://odmgroove.vercel.app/events/${event.id}`,
      siteName: "ODM Groove Hotel & Event Hall",
      type: "website",
      locale: "en_NG",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = EVENTS.find((e) => e.id === resolvedParams.id);
  if (!event) notFound();
  return <EventDetailClient event={event} />;
}
