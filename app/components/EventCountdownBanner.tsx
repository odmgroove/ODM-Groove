"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Flame } from "lucide-react";
import { getFeaturedEvent, formatEventDate } from "../lib/eventsData";

const BANNER_DISMISSED_KEY = "odm_banner_dismissed_v1";

function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      expired: false,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function BannerInner({ onDismiss }: { onDismiss: () => void }) {
  const event = getFeaturedEvent();
  const countdown = useCountdown(event?.date ?? "");

  if (!event || countdown.expired) return null;

  const accentColor = event.accentColor;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] w-full text-white text-xs sm:text-sm flex items-center justify-center gap-3 sm:gap-5 px-4 py-3 overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10"
      style={{ background: `linear-gradient(90deg, #0a0a0a 0%, ${accentColor}55 40%, ${accentColor}55 60%, #0a0a0a 100%)` }}
    >
      {/* Animated shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 30%, ${accentColor}25 50%, transparent 70%)`,
          animation: "shimmer 3s infinite linear",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Flame icon */}
      <Flame size={14} className="flex-shrink-0 animate-pulse" style={{ color: accentColor }} />

      {/* Event name */}
      <Link
        href={`/events/${event.id}`}
        className="font-semibold tracking-wide hover:underline flex-shrink-0"
        style={{ color: accentColor }}
      >
        {event.title} — {event.subtitle}
      </Link>

      {/* Separator */}
      <span className="text-white/30 hidden sm:block">·</span>

      {/* Countdown chips */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {countdown.days > 0 && (
          <>
            <span className="font-bold tabular-nums" style={{ color: accentColor }}>
              {pad(countdown.days)}d
            </span>
            <span className="text-white/30">:</span>
          </>
        )}
        <span className="font-bold tabular-nums" style={{ color: accentColor }}>
          {pad(countdown.hours)}h
        </span>
        <span className="text-white/30">:</span>
        <span className="font-bold tabular-nums" style={{ color: accentColor }}>
          {pad(countdown.minutes)}m
        </span>
        <span className="text-white/30">:</span>
        <span className="font-bold tabular-nums" style={{ color: accentColor }}>
          {pad(countdown.seconds)}s
        </span>
      </div>

      {/* Separator */}
      <span className="text-white/30 hidden sm:block">·</span>

      {/* Reserve CTA */}
      <a
        href={`https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(`Hi, I'd like to reserve for ${event.title} on ${formatEventDate(event.date)}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0"
        style={{ background: accentColor, color: "#0a0a0a" }}
      >
        Reserve →
      </a>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        aria-label="Close banner"
      >
        <X size={14} />
      </button>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  );
}

export default function EventCountdownBanner() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid SSR flash
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = sessionStorage.getItem(BANNER_DISMISSED_KEY);
    if (!raw) setDismissed(false);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(BANNER_DISMISSED_KEY, "1");
    setDismissed(true);
  };

  if (!mounted || dismissed) return null;

  return <BannerInner onDismiss={dismiss} />;
}
