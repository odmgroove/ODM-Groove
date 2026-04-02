"use client";

import { useState } from "react";
import { Users, Copy, Check, MessageCircle } from "lucide-react";
import { formatEventDate, type Event } from "../lib/eventsData";

interface Props {
  event: Event;
}

export default function BringAFriendNudge({ event }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://odmgroove.vercel.app/events/${event.id}`;

  // Pre-written "tag your squad" WhatsApp message
  const squadMessage =
    `💦 Bro/Sis, we're going to this 👇\n\n` +
    `*${event.title} — ${event.subtitle}*\n` +
    `📅 ${formatEventDate(event.date)}\n` +
    `⏰ 5PM ${event.endTime}\n` +
    `📍 Ijoko · Ogun State\n\n` +
    `🎟 *${event.ticketPrices.map((t) => `${t.label}: ₦${t.price.toLocaleString()}`).join(" · ")}*\n\n` +
    `Book together 👉 ${shareUrl}\n\n` +
    event.hashtags.join(" ");

  const waGroupUrl = `https://wa.me/?text=${encodeURIComponent(squadMessage)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(squadMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {}
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: `${event.accentColor}30`, background: `${event.accentColor}08` }}
    >
      <div className="px-6 py-5 border-b" style={{ borderColor: `${event.accentColor}20` }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <h3 className="text-[var(--off-white)] font-bold text-base">Drag Your Crew In</h3>
            <p className="text-[var(--warm-gray)] text-xs">
              Better with your people — send them this and plan together
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Message preview */}
        <div className="bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg p-4">
          <p className="text-[var(--warm-gray)] text-xs leading-relaxed whitespace-pre-line font-sans">
            {squadMessage}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={waGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
            style={{ background: event.accentColor, color: "#0a0a0a" }}
          >
            <MessageCircle size={15} />
            Send on WhatsApp
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wider border border-[var(--dark-border)] text-[var(--warm-gray)] hover:border-[var(--gold)]/40 hover:text-[var(--gold)] transition-all"
          >
            {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy Text</>}
          </button>
        </div>

        {/* Nudge line */}
        <p className="text-[var(--text-muted)] text-xs text-center">
          Groups are more fun. Events fill faster when people book together. 👯
        </p>
      </div>
    </div>
  );
}
