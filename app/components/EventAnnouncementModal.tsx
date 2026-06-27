"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Share2,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";

// We define a local parsed event type that matches what we use in the UI
export type ParsedEvent = {
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
  ticketPrices: { label: string; price: number }[];
  contactNumbers: string[];
  hashtags: string[];
  whatsappNumber: string;
  image: string | null;
  posterImage: string | null;
  accentColor: string;
  artists: string[] | null;
  ageLimit: number | null;
  extras: string[] | null;
};

const DISMISS_KEY = "odm_event_modal_dismissed_v2";
const DISMISS_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function isDismissed(): boolean {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw);
    return Date.now() - ts < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

function setDismissed() {
  try {
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify({ ts: Date.now() }));
  } catch {}
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EventSlide({
  event,
  onClose,
}: {
  event: ParsedEvent;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://odmgroove.vercel.app/events/${event.id}`;
  const shareText =
    `🎉 ${event.title} — ${event.subtitle || ""}\n\n` +
    `📅 ${formatEventDate(event.date)}\n` +
    `⏰ 5PM ${event.endTime}\n` +
    `📍 ${event.venue}\n` +
    `🎟 ${event.ticketPrices.map((t) => `${t.label}: ₦${t.price.toLocaleString()}`).join(" | ")}\n\n` +
    `Reserve: ${event.contactNumbers[0]}\n\n` +
    `${event.hashtags.join(" ")}\n\n` +
    shareUrl;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${event.title}`, text: shareText, url: shareUrl });
      } catch {}
    } else {
      try { await navigator.clipboard.writeText(shareText); } catch {}
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const displayImage = event.posterImage || event.image;

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-0 w-full relative bg-[var(--dark-card)]">
      {/* Visual Side (Image) */}
      {displayImage && (
        <div className="md:w-1/2 relative h-48 md:h-auto flex-shrink-0 border-b md:border-b-0 md:border-r border-[var(--dark-border)]">
          <Image
            src={displayImage}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-card)] md:bg-gradient-to-r md:from-transparent via-transparent to-transparent md:to-[var(--dark-card)]" />
          
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg"
              style={{ color: "#fff", background: event.accentColor }}
            >
              <Flame size={12} /> Upcoming
            </span>
          </div>
        </div>
      )}

      {/* Content Side */}
      <div className={`flex flex-col flex-1 p-6 sm:p-8 overflow-y-auto ${!displayImage ? 'w-full' : 'md:w-1/2'}`}>
        {/* Glow bg for content area */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top right, ${event.accentColor} 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex flex-col flex-1 gap-5">
          {/* Title block */}
          <div>
            {event.artists && event.artists.length > 0 && (
              <p className="text-[var(--warm-gray)] text-xs tracking-[0.3em] uppercase font-medium mb-2">
                {event.artists.join(" × ")} presents
              </p>
            )}
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-[var(--off-white)] leading-tight mb-1"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {event.title}
            </h2>
            {event.subtitle && (
              <h3
                className="font-display text-xl sm:text-2xl font-bold italic"
                style={{ fontFamily: "Playfair Display, serif", color: event.accentColor }}
              >
                {event.subtitle}
              </h3>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-[var(--off-white)]/80">
              <Calendar size={16} className="text-[var(--gold)] flex-shrink-0" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--off-white)]/80">
              <Clock size={16} className="text-[var(--gold)] flex-shrink-0" />
              <span>5PM {event.endTime}</span>
            </div>
            <div className="flex items-start gap-3 text-[var(--off-white)]/80">
              <MapPin size={16} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{event.venue}</span>
            </div>
          </div>

          {/* Ticket prices */}
          {event.ticketPrices.length > 0 && (
            <div className="bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg p-4 mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <Ticket size={14} className="text-[var(--gold)]" />
                <span className="text-[var(--gold)] text-xs uppercase tracking-[0.2em] font-semibold">Ticket Prices</span>
              </div>
              <div className="space-y-0">
                {event.ticketPrices.map((t) => (
                  <div
                    key={t.label}
                    className="flex justify-between items-center py-2.5 border-b border-[var(--dark-border)] last:border-0"
                  >
                    <span className="text-[var(--off-white)] font-medium text-sm">{t.label}</span>
                    <span
                      className="font-display text-xl font-bold"
                      style={{ fontFamily: "Playfair Display, serif", color: event.accentColor }}
                    >
                      ₦{t.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/events/${event.id}`}
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-bold uppercase tracking-wider transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{ background: event.accentColor, color: "#000" }}
            >
              <Ticket size={16} /> Reserve Now
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-bold uppercase tracking-wider border border-[var(--dark-border)] text-[var(--off-white)] hover:bg-white/5 transition-colors"
            >
              <Share2 size={16} /> {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventAnnouncementModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeEvents, setActiveEvents] = useState<ParsedEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events?status=upcoming");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        // Parse DB strings into arrays/objects
        const parsed: ParsedEvent[] = data.map((e: any) => ({
          ...e,
          ticketPrices: JSON.parse(e.ticketPrices),
          contactNumbers: e.contactNumbers.split(",").map((s: string) => s.trim()),
          hashtags: e.hashtags.split(",").map((s: string) => s.trim()),
          artists: e.artists ? e.artists.split(",").map((s: string) => s.trim()) : null,
          extras: e.extras ? e.extras.split(",").map((s: string) => s.trim()) : null,
        }));

        // Filter events that haven't started/ended yet (hide 2 hours after start)
        const active = parsed.filter(event => {
          const startMs = new Date(event.date).getTime();
          return Date.now() < startMs + 2 * 60 * 60 * 1000;
        });

        setActiveEvents(active);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (loading || activeEvents.length === 0) return;

    // Delay slightly for page load feel
    const timer = setTimeout(() => {
      if (!isDismissed()) {
        setIsVisible(true);
        document.body.style.overflow = "hidden";
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [loading, activeEvents.length]);

  const close = useCallback(() => {
    setIsVisible(false);
    setDismissed();
    document.body.style.overflow = "auto";
  }, []);

  const goTo = (idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(idx);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prev = () => goTo((currentIndex - 1 + activeEvents.length) % activeEvents.length);
  const next = () => goTo((currentIndex + 1) % activeEvents.length);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  if (!isVisible || activeEvents.length === 0) return null;

  const event = activeEvents[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={close}
        style={{ animation: "fadeIn 0.4s ease" }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden border border-[var(--dark-border)] bg-[var(--dark)] shadow-2xl"
        style={{ 
          animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)", 
          boxShadow: `0 0 80px ${event.accentColor}40, 0 25px 60px rgba(0,0,0,0.8)` 
        }}
      >
        {/* Close button - visually floating */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-[50] w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)] shadow-lg"
          aria-label="Close announcement"
        >
          <X size={18} />
        </button>

        {/* Slide content */}
        <div
          className="flex-1 flex flex-col overflow-hidden transition-opacity duration-300 relative min-h-0"
          style={{ opacity: isAnimating ? 0 : 1 }}
        >
          <EventSlide event={event} onClose={close} />
        </div>

        {/* Slider controls & Footer */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-[var(--dark-border)] bg-[var(--black)]/80 backdrop-blur-md">
          {activeEvents.length > 1 ? (
            <div className="flex items-center gap-6">
              <button
                onClick={prev}
                className="w-8 h-8 rounded-full border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                aria-label="Previous event"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {activeEvents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="rounded-full transition-all duration-300 focus:outline-none"
                    style={{
                      width: i === currentIndex ? 24 : 8,
                      height: 8,
                      background: i === currentIndex ? activeEvents[i].accentColor : "var(--dark-border)",
                    }}
                    aria-label={`Go to event ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-8 h-8 rounded-full border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                aria-label="Next event"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div /> // Spacer
          )}

          <button onClick={close} className="text-[var(--text-muted)] text-xs font-medium hover:text-[var(--warm-gray)] transition-colors focus:outline-none focus:underline">
            Dismiss · won&apos;t show again for 12h
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}
