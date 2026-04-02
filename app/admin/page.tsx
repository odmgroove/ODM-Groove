"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  ArrowLeft,
  Calendar,
  Ticket,
  Share2,
  ExternalLink,
  CheckCircle,
  Eye,
  Copy,
  Phone,
  AlertCircle,
  Clock,
  Send,
  Zap,
} from "lucide-react";
import { EVENTS, formatEventDate, type Event } from "../lib/eventsData";

const ADMIN_PASSWORD = "$odmgroove2024$"; // ← change this in production!

function EventAdminCard({ event }: { event: Event }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://odmgroove.vercel.app/events/${event.id}`;

  const whatsappCopy =
    `🎉 *${event.title} — ${event.subtitle}!*\n\n` +
    `📅 ${formatEventDate(event.date)}\n` +
    `⏰ 5PM ${event.endTime}\n` +
    `📍 ${event.venue}\n\n` +
    `🎟 *TICKETS:*\n` +
    event.ticketPrices.map((t) => `   • ${t.label}: ₦${t.price.toLocaleString()}`).join("\n") +
    `\n\n📲 Reserve your spot now:\n${event.contactNumbers.join(" | ")}\n\n` +
    `🔗 Full details & booking:\n${shareUrl}\n\n` +
    event.hashtags.join(" ");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(whatsappCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {}
  };

  const isExpired = new Date(event.date).getTime() < Date.now();

  return (
    <div
      className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden"
      style={{ borderTop: `3px solid ${event.accentColor}` }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isExpired
                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                    : event.status === "live"
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                }`}
              >
                {isExpired ? "⚠ Expired" : event.status === "live" ? "🔴 Live" : "✓ Upcoming"}
              </span>
              {event.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                  ★ Featured
                </span>
              )}
            </div>
            <h3
              className="font-display text-2xl font-bold text-[var(--off-white)]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {event.title}
            </h3>
            <p className="text-sm font-medium" style={{ color: event.accentColor }}>
              {event.subtitle}
            </p>
          </div>
          {event.image && (
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--dark-border)] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.image} alt="poster" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm text-[var(--warm-gray)]">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-[var(--gold)]" />
            {formatEventDate(event.date)} · 5PM
          </div>
          <div className="flex items-center gap-2">
            <Ticket size={13} className="text-[var(--gold)]" />
            {event.ticketPrices.map((t) => `${t.label}: ₦${t.price.toLocaleString()}`).join(" · ")}
          </div>
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-[var(--gold)]" />
            {event.contactNumbers.join(" · ")}
          </div>
          <div className="flex items-center gap-2 col-span-full">
            <ExternalLink size={13} className="text-[var(--gold)]" />
            <span className="text-xs text-[var(--text-muted)] break-all">{shareUrl}</span>
          </div>
        </div>

        {/* Extras */}
        {event.extras && (
          <div className="flex flex-wrap gap-2 mb-5">
            {event.extras.map((e, i) => (
              <span key={i} className="flex items-center gap-1 text-xs bg-[var(--dark)] border border-[var(--dark-border)] px-2.5 py-1 rounded-full text-[var(--warm-gray)]">
                <CheckCircle size={10} className="text-[var(--gold)]" /> {e}
              </span>
            ))}
          </div>
        )}

        {/* WhatsApp blast preview */}
        <div className="bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg p-4 mb-4">
          <p className="text-[var(--gold)] text-xs uppercase tracking-widest font-semibold mb-3">
            📲 WhatsApp Blast Message
          </p>
          <pre className="text-[var(--warm-gray)] text-xs leading-relaxed whitespace-pre-wrap font-sans">
            {whatsappCopy}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/events/${event.id}`}
            target="_blank"
            className="flex items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider border border-[var(--dark-border)] text-[var(--off-white)] hover:border-[var(--gold)]/40 hover:text-[var(--gold)] transition-all"
          >
            <Eye size={14} /> Preview Page
          </Link>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            style={{
              background: copied ? "#22c55e20" : `${event.accentColor}20`,
              color: copied ? "#22c55e" : event.accentColor,
              border: `1px solid ${copied ? "#22c55e40" : `${event.accentColor}40`}`,
            }}
          >
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copied ? "Copied! Paste in WhatsApp" : "Copy WhatsApp Message"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(whatsappCopy)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all"
          >
            <Share2 size={14} /> Send via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Blast Scheduler ───────────────────────────────────────────────────────────
function BlastScheduler({ event }: { event: Event }) {
  const eventDate = new Date(event.date);
  const now = new Date();

  const blasts = [
    {
      id: "announce",
      emoji: "🚀",
      label: "Announcement Blast",
      desc: "First drop — maximum reach",
      timing: "As soon as event is confirmed",
      daysBeforeEvent: null,
      message:
        `🎉 *IT'S OFFICIAL — ${event.title.toUpperCase()} IS HAPPENING!*\n\n` +
        `*${event.subtitle}*\n\n` +
        `📅 ${formatEventDate(event.date)}\n` +
        `⏰ 5PM Till Dawn\n` +
        `📍 Ijoko · Ogba-Ayo · Ogun State\n\n` +
        `🎟 *TICKETS:*\n` +
        event.ticketPrices.map((t) => `   ${t.label} — ₦${t.price.toLocaleString()}`).join("\n") +
        `\n\n📲 *Reserve your spot NOW before it fills up:*\n` +
        event.contactNumbers.join(" | ") +
        `\n\n🔗 Full details:\nhttps://odmgroove.vercel.app/events/${event.id}\n\n` +
        `${event.hashtags.join(" ")}\n\n` +
        `_Water guns available. Maximum security. 18+ only._`,
    },
    {
      id: "reminder",
      emoji: "⏰",
      label: "1-Week Reminder",
      desc: "Catch people who missed the first blast",
      timing: new Date(eventDate.getTime() - 7 * 86400000).toDateString(),
      daysBeforeEvent: 7,
      message:
        `⏰ *ONE WEEK TO GO — ${event.title.toUpperCase()}!*\n\n` +
        `Still haven't reserved? The pool is waiting 💦\n\n` +
        `📅 ${formatEventDate(event.date)} · 5PM Till Dawn\n` +
        `📍 Ijoko · Ogun State\n\n` +
        `🎟 ${event.ticketPrices.map((t) => `${t.label}: ₦${t.price.toLocaleString()}`).join(" | ")}\n\n` +
        `📲 Call/WhatsApp to reserve:\n${event.contactNumbers.join(" · ")}\n\n` +
        `🔗 https://odmgroove.vercel.app/events/${event.id}\n\n` +
        `Who are you bringing? Tag them 👇`,
    },
    {
      id: "lastcall",
      emoji: "🔥",
      label: "Last Call Blast",
      desc: "Urgency — highest conversion rate",
      timing: new Date(eventDate.getTime() - 86400000).toDateString(),
      daysBeforeEvent: 1,
      message:
        `🔥 *LAST CALL — TOMORROW IS THE DAY!*\n\n` +
        `*${event.title} — ${event.subtitle}*\n` +
        `📅 TOMORROW · ${formatEventDate(event.date)}\n` +
        `📍 Ijoko · Ogun State · 5PM\n\n` +
        `If you haven't reserved, do it NOW 👇\n` +
        event.contactNumbers.map((n) => `📞 ${n}`).join("\n") +
        `\n\n_Spaces are limited. First come, first served._\n\n` +
        `${event.hashtags.slice(0, 4).join(" ")}\n\n` +
        `🔗 https://odmgroove.vercel.app/events/${event.id}`,
    },
    {
      id: "daytime",
      emoji: "🌊",
      label: "Day-Of Hype",
      desc: "Send at 12PM on event day — maximum energy",
      timing: eventDate.toDateString() + " · Send at 12:00 PM",
      daysBeforeEvent: 0,
      message:
        `🌊 *TODAY IS THE DAY!! ${event.title.toUpperCase()} 🎉*\n\n` +
        `The pool is ready. The music is lined up. Are YOU?\n\n` +
        `⏰ Doors open at 5PM TODAY\n` +
        `📍 Shonekan St, Olaoparun, Ijoko · Ogun State\n\n` +
        `💦 Dress light. Come ready to get wet.\n` +
        `🔫 Water guns on sale at the venue.\n\n` +
        `Last minute reservations:\n` +
        event.contactNumbers.map((n) => `📞 ${n}`).join("\n") +
        `\n\n*SEE YOU TONIGHT!* 🔥\n${event.hashtags.join(" ")}`,
    },
  ];

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, msg: string) => {
    try { await navigator.clipboard.writeText(msg); } catch {}
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getDaysUntil = (daysBeforeEvent: number | null) => {
    if (daysBeforeEvent === null) return null;
    const blastDate = new Date(eventDate.getTime() - daysBeforeEvent * 86400000);
    const diff = Math.ceil((blastDate.getTime() - now.getTime()) / 86400000);
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    if (diff === 0) return "Today";
    return `In ${diff} days`;
  };

  return (
    <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--dark-border)] flex items-center gap-3">
        <Zap size={16} className="text-[var(--gold)]" />
        <div>
          <h3 className="text-[var(--off-white)] font-bold">WhatsApp Blast Schedule</h3>
          <p className="text-[var(--warm-gray)] text-xs">
            4 timed blasts — each pre-written and ready to copy
          </p>
        </div>
      </div>
      <div className="divide-y divide-[var(--dark-border)]">
        {blasts.map((blast) => {
          const daysLabel = getDaysUntil(blast.daysBeforeEvent);
          const isPast = daysLabel?.includes("ago");
          return (
            <div key={blast.id} className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{blast.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[var(--off-white)] font-semibold text-sm">{blast.label}</p>
                      {daysLabel && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPast
                              ? "bg-[var(--dark-border)] text-[var(--warm-gray)]"
                              : daysLabel === "Today"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30"
                          }`}
                        >
                          {daysLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--warm-gray)] text-xs mt-0.5">{blast.desc}</p>
                    <p className="text-[var(--text-muted)] text-xs mt-1 flex items-center gap-1">
                      <Clock size={10} /> {blast.timing}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message preview */}
              <div className="bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg p-3 mb-3">
                <pre className="text-[var(--warm-gray)] text-xs leading-relaxed whitespace-pre-wrap font-sans line-clamp-4">
                  {blast.message}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(blast.id, blast.message)}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                  style={
                    copiedId === blast.id
                      ? { background: "#22c55e20", color: "#22c55e", border: "1px solid #22c55e40" }
                      : { background: "var(--dark)", color: "var(--warm-gray)", border: "1px solid var(--dark-border)" }
                  }
                >
                  {copiedId === blast.id ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(blast.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-500/15 border border-green-500/25 text-green-400 hover:bg-green-500/25 transition-all"
                >
                  <Send size={12} /> Send Now
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthed(true);
      setError("");
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[var(--black)] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[var(--dark-card)] border border-[var(--dark-border)] flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-[var(--gold)]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[var(--off-white)] mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
              Admin Panel
            </h1>
            <p className="text-[var(--warm-gray)] text-sm">ODM Groove · Event Management</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-3 text-[var(--off-white)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={12} /> {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
              style={{ background: "var(--gold)", color: "var(--black)" }}
            >
              Enter
            </button>
          </form>
          <p className="text-center text-[var(--text-muted)] text-xs mt-4">
            <Link href="/" className="hover:text-[var(--warm-gray)] transition-colors">← Back to website</Link>
          </p>
        </div>
      </div>
    );
  }

  const upcomingEvents = EVENTS.filter((e) => e.status === "upcoming" || e.status === "live");
  const pastEvents = EVENTS.filter((e) => e.status === "past" || new Date(e.date).getTime() < Date.now());

  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--off-white)]">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[var(--dark)] border-b border-[var(--dark-border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors text-sm">
            <ArrowLeft size={15} /> Back to site
          </Link>
          <div className="h-4 w-px bg-[var(--dark-border)]" />
          <h1 className="text-[var(--off-white)] font-semibold text-sm">ODM Groove — Admin</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--warm-gray)]">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {EVENTS.length} event{EVENTS.length !== 1 ? "s" : ""} in system
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* How to add events */}
        <div className="bg-[var(--dark-card)] border border-[var(--gold)]/20 rounded-xl p-6 mb-10">
          <h2 className="text-[var(--gold)] font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertCircle size={14} /> How to Add a New Event
          </h2>
          <div className="text-[var(--warm-gray)] text-sm leading-relaxed space-y-2">
            <p>1. Open <code className="bg-[var(--dark)] px-2 py-0.5 rounded text-[var(--off-white)] text-xs">app/lib/eventsData.ts</code> in your code editor.</p>
            <p>2. Copy the template comment at the bottom of the <code className="bg-[var(--dark)] px-2 py-0.5 rounded text-[var(--off-white)] text-xs">EVENTS</code> array and fill in your event details.</p>
            <p>3. Add your event poster image to <code className="bg-[var(--dark)] px-2 py-0.5 rounded text-[var(--off-white)] text-xs">public/events/your-image.jpg</code> and reference it in the <code className="bg-[var(--dark)] px-2 py-0.5 rounded text-[var(--off-white)] text-xs">image</code> field.</p>
            <p>4. Deploy to Vercel — the event will automatically appear on the site, homepage modal, and event page.</p>
            <p>5. Set <code className="bg-[var(--dark)] px-2 py-0.5 rounded text-[var(--off-white)] text-xs">status: &quot;past&quot;</code> after the event ends so it stops showing in upcoming.</p>
          </div>
        </div>

        {/* Upcoming */}
        {upcomingEvents.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display text-xl font-bold text-[var(--off-white)]" style={{ fontFamily: "Playfair Display, serif" }}>
                Active Events ({upcomingEvents.length})
              </h2>
              <div className="h-px flex-1 bg-[var(--dark-border)]" />
            </div>
            <div className="space-y-6">
              {upcomingEvents.map((e) => (
                <div key={e.id} className="space-y-4">
                  <EventAdminCard event={e} />
                  <BlastScheduler event={e} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        {pastEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display text-xl font-bold text-[var(--warm-gray)]" style={{ fontFamily: "Playfair Display, serif" }}>
                Past Events ({pastEvents.length})
              </h2>
              <div className="h-px flex-1 bg-[var(--dark-border)]" />
            </div>
            <div className="space-y-6 opacity-60">
              {pastEvents.map((e) => <EventAdminCard key={e.id} event={e} />)}
            </div>
          </div>
        )}

        {EVENTS.length === 0 && (
          <div className="text-center py-20 text-[var(--warm-gray)]">
            <Calendar size={40} className="mx-auto mb-4 opacity-30" />
            <p>No events yet. Add one in eventsData.ts to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
