"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
import { getUpcomingEvents, formatEventDate, type Event } from "../lib/eventsData";

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

function isEventActive(event: Event): boolean {
  // Hide event 2 hours after it starts (enough buffer)
  const startMs = new Date(event.date).getTime();
  return Date.now() < startMs + 2 * 60 * 60 * 1000;
}

function EventSlide({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://odmgroove.vercel.app/events/${event.id}`;
  const shareText =
    `🎉 ${event.title} — ${event.subtitle}!\n\n` +
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
        await navigator.share({ title: `${event.title} — ${event.subtitle}`, text: shareText, url: shareUrl });
      } catch {}
    } else {
      try { await navigator.clipboard.writeText(shareText); } catch {}
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      {/* Accent bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${event.accentColor}, transparent)` }} />

      {/* Glow bg */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top center, ${event.accentColor} 0%, transparent 65%)`,
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-5 flex-1 overflow-y-auto">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border animate-pulse"
            style={{ color: event.accentColor, borderColor: `${event.accentColor}50`, background: `${event.accentColor}15` }}
          >
            <Flame size={10} /> Upcoming Event
          </span>
          {event.ageLimit && (
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--warm-gray)] text-xs font-medium">
              {event.ageLimit}+ Only
            </span>
          )}
        </div>

        {/* Title block */}
        <div>
          {event.artists && (
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
          <h3
            className="font-display text-xl sm:text-2xl font-bold italic"
            style={{ fontFamily: "Playfair Display, serif", color: event.accentColor }}
          >
            {event.subtitle}
          </h3>
        </div>

        {/* Details */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-3 text-[var(--off-white)]/80">
            <Calendar size={15} className="text-[var(--gold)] flex-shrink-0" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-[var(--off-white)]/80">
            <Clock size={15} className="text-[var(--gold)] flex-shrink-0" />
            <span>5PM {event.endTime}</span>
          </div>
          <div className="flex items-start gap-3 text-[var(--off-white)]/80">
            <MapPin size={15} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{event.venue}</span>
          </div>
        </div>

        {/* Ticket prices */}
        <div className="bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={13} className="text-[var(--gold)]" />
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

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Link
            href={`/events/${event.id}`}
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:brightness-110"
            style={{ background: event.accentColor, color: "#0a0a0a" }}
          >
            <Ticket size={15} /> View Event & Reserve
          </Link>
          <a
            href={whatsappShare}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-bold uppercase tracking-wider border border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-200"
          >
            <Share2 size={15} /> Share on WhatsApp
          </a>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {event.hashtags.map((tag) => (
            <span key={tag} className="text-[10px] text-[var(--warm-gray)]">{tag}</span>
          ))}
        </div>
        
        {/* Safe space at the bottom to prevent scroll clipping */}
        <div className="h-1 flex-shrink-0 pt-2" />
      </div>
    </div>
  );
}

export default function EventAnnouncementModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const upcoming = getUpcomingEvents().filter(isEventActive);
    if (upcoming.length === 0) return;
    setActiveEvents(upcoming);

    // Delay slightly for page load feel
    const timer = setTimeout(() => {
      if (!isDismissed()) {
        setIsVisible(true);
        document.body.style.overflow = "hidden";
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

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
      aria-label="Upcoming event announcement"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={close}
        style={{ animation: "fadeIn 0.3s ease" }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl overflow-hidden border border-[var(--dark-border)] bg-[var(--dark-card)] shadow-2xl"
        style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 0 60px ${event.accentColor}30, 0 25px 60px rgba(0,0,0,0.8)` }}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[var(--dark)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-white hover:border-white/30 transition-all"
          aria-label="Close announcement"
        >
          <X size={15} />
        </button>

        {/* Slide content */}
        <div
          className="flex-1 flex flex-col overflow-hidden transition-opacity duration-300 relative min-h-0"
          style={{ opacity: isAnimating ? 0 : 1 }}
        >
          <EventSlide event={event} onClose={close} />
        </div>

        {/* Slider controls — only shown when multiple events */}
        {activeEvents.length > 1 && (
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-t border-[var(--dark-border)] bg-[var(--dark)]">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {activeEvents.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentIndex ? 20 : 8,
                    height: 8,
                    background: i === currentIndex ? activeEvents[i].accentColor : "var(--dark-border)",
                  }}
                  aria-label={`Event ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-8 h-8 rounded-full border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* "Don't show again" text */}
        <div className="flex-shrink-0 text-center py-2.5 bg-[var(--dark)] border-t border-[var(--dark-border)]">
          <button onClick={close} className="text-[var(--text-muted)] text-xs hover:text-[var(--warm-gray)] transition-colors">
            Dismiss · won&apos;t show again for 12 hours
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}
