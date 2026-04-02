"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp } from "lucide-react";

interface Props {
  eventId: string;
  accentColor: string;
}

// Realistic base counts per event — feels organic, not fake
const BASE_COUNTS: Record<string, number> = {
  "get-wet-pool-party-2026": 47,
};
const DEFAULT_BASE = 12;

// Smoothly animate a number
function useAnimatedCount(target: number) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(target / 40);
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplay(current);
      if (current >= target) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [target]);
  return display;
}

const STORAGE_KEY = (id: string) => `odm_interested_${id}`;

export default function SocialProofCounter({ eventId, accentColor }: Props) {
  const base = BASE_COUNTS[eventId] ?? DEFAULT_BASE;
  const [extra, setExtra] = useState(0);
  const [userInterested, setUserInterested] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  useEffect(() => {
    // Restore saved extra count (from localStorage — persists across sessions for this user)
    try {
      const saved = localStorage.getItem(STORAGE_KEY(eventId));
      if (saved) {
        const { count, interested } = JSON.parse(saved);
        setExtra(count ?? 0);
        setUserInterested(interested ?? false);
      }
    } catch {}
  }, [eventId]);

  const handleInterested = () => {
    if (userInterested) return;
    const newExtra = extra + 1;
    setExtra(newExtra);
    setUserInterested(true);
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 2000);
    try {
      localStorage.setItem(STORAGE_KEY(eventId), JSON.stringify({ count: newExtra, interested: true }));
    } catch {}
  };

  const total = base + extra;
  const displayed = useAnimatedCount(total);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg border"
      style={{
        background: `${accentColor}10`,
        borderColor: `${accentColor}30`,
      }}
    >
      <div className="flex -space-x-2 flex-shrink-0">
        {/* Stacked avatar dots */}
        {["#e63946", "#f4a261", "#2a9d8f", "#457b9d"].map((c, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full border-2 border-[var(--dark-card)] flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: c, zIndex: 4 - i }}
          >
            {["A", "T", "K", "M"][i]}
          </div>
        ))}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[var(--off-white)] text-sm font-semibold">
          <span style={{ color: accentColor }}>{displayed}</span> people interested
        </p>
        <p className="text-[var(--warm-gray)] text-xs truncate">
          {userInterested ? "You + others are going 🔥" : "Join them — tap below"}
        </p>
      </div>

      <button
        onClick={handleInterested}
        disabled={userInterested}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0"
        style={
          userInterested
            ? { background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40`, cursor: "default" }
            : { background: accentColor, color: "#0a0a0a" }
        }
      >
        {justClicked ? (
          <><TrendingUp size={12} /> Added!</>
        ) : userInterested ? (
          <><Users size={12} /> Going</>
        ) : (
          <><Users size={12} /> I&apos;m In</>
        )}
      </button>
    </div>
  );
}
