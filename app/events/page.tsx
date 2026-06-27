"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Ticket, ChevronRight, ArrowLeft, Users } from "lucide-react";

type EventDB = {
  id: string;
  title: string;
  subtitle?: string | null;
  description: string;
  longDescription?: string | null;
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
  image?: string | null;
  accentColor: string;
  artists?: string | null;
  ageLimit?: number | null;
  extras?: string | null;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function EventCard({ event }: { event: EventDB }) {
  const prices = (() => { try { return JSON.parse(event.ticketPrices); } catch { return []; } })();
  const isPast = event.status === "past" || new Date(event.date).getTime() < Date.now();
  const isLive = event.status === "live";
  const contacts = event.contactNumbers.split(",").map(c => c.trim());

  return (
    <div className={`group relative bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isPast ? "opacity-70" : ""}`}
      style={{ boxShadow: `0 0 0 1px ${event.accentColor}20` }}>
      {/* Top accent */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${event.accentColor}80, ${event.accentColor}, ${event.accentColor}80)` }} />

      {/* Image */}
      {event.image && (
        <div className="relative h-48 overflow-hidden">
          <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-card)] via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {isLive && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/90 text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Live Now
              </span>
            )}
            {isPast && !isLive && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-[var(--warm-gray)] border border-[var(--dark-border)]">Past Event</span>
            )}
            {!isPast && !isLive && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/80 text-white">Upcoming</span>
            )}
            {event.featured && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--gold)]/90 text-[var(--black)]">★ Featured</span>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Date & Status (if no image) */}
        {!event.image && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {isLive && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live Now</span>}
            {isPast && !isLive && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--dark-border)] text-[var(--warm-gray)]">Past Event</span>}
            {!isPast && !isLive && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">Upcoming</span>}
            {event.featured && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">★ Featured</span>}
          </div>
        )}

        <h3 className="font-display text-2xl font-bold text-[var(--off-white)] mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
          {event.title}
        </h3>
        {event.subtitle && (
          <p className="text-sm font-semibold mb-3" style={{ color: event.accentColor }}>{event.subtitle}</p>
        )}

        <p className="text-sm text-[var(--warm-gray)] line-clamp-2 mb-4 leading-relaxed">{event.description}</p>

        {/* Meta */}
        <div className="space-y-2 mb-4 text-xs text-[var(--warm-gray)]">
          <div className="flex items-start gap-2">
            <Calendar size={12} className="mt-0.5 shrink-0" style={{ color: event.accentColor }} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} style={{ color: event.accentColor }} />
            <span>5PM — {event.endTime}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={12} className="mt-0.5 shrink-0" style={{ color: event.accentColor }} />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          {event.ageLimit && (
            <div className="flex items-center gap-2">
              <Users size={12} style={{ color: event.accentColor }} />
              <span>{event.ageLimit}+ only</span>
            </div>
          )}
        </div>

        {/* Ticket Prices */}
        {prices.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {prices.map((t: { label: string; price: number }, i: number) => (
              <span key={i} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border"
                style={{ borderColor: `${event.accentColor}40`, color: event.accentColor, background: `${event.accentColor}10` }}>
                <Ticket size={10} /> {t.label}: ₦{t.price?.toLocaleString()}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link href={`/events/${event.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border"
            style={{ borderColor: `${event.accentColor}50`, color: event.accentColor, background: `${event.accentColor}10` }}
          >
            View Details <ChevronRight size={14} />
          </Link>
          {!isPast && (
            <a
              href={`https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(`Hi! I'd like to get more info about ${event.title}.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all"
            >
              Book Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    fetch("/api/events?status=all")
      .then(r => r.json())
      .then(data => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const upcoming = events.filter(e => e.status !== "past" && new Date(e.date).getTime() >= Date.now());
  const past = events.filter(e => e.status === "past" || new Date(e.date).getTime() < Date.now());

  const filtered = filter === "upcoming" ? upcoming : filter === "past" ? past : events;

  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--off-white)]">
      {/* Hero */}
      <div className="relative overflow-hidden pt-28 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors mb-8 uppercase tracking-widest">
            <ArrowLeft size={12} /> Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-[var(--gold)]/60" />
            <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">ODM Groove</span>
            <div className="h-px w-10 bg-[var(--gold)]/60" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--off-white)] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
            Events
          </h1>
          <p className="text-[var(--warm-gray)] text-lg max-w-md mx-auto">
            Past experiences & upcoming celebrations at ODM Groove Hotel.
          </p>

          {/* Filter tabs */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {(["all", "upcoming", "past"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === tab
                    ? "bg-[var(--gold)] text-[var(--black)]"
                    : "bg-[var(--dark-card)] border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--off-white)]"
                }`}
              >
                {tab === "all" ? `All (${events.length})` : tab === "upcoming" ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-[var(--warm-gray)]">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No {filter !== "all" ? filter : ""} events found.</p>
            {filter !== "all" && (
              <button onClick={() => setFilter("all")} className="mt-4 text-[var(--gold)] text-sm hover:underline">Show all events</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  );
}
