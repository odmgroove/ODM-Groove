"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Ticket, Share2, Phone, ArrowLeft, CheckCircle, Users } from "lucide-react";
import { formatEventDate, type Event } from "../../lib/eventsData";

function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000), expired: false };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => { const id = setInterval(() => setTime(calc()), 1000); return () => clearInterval(id); }, []);
  return time;
}

export default function EventDetailClient({ event }: { event: Event }) {
  const countdown = useCountdown(event.date);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://odmgroove.vercel.app/events/${event.id}`;
  const shareText = `🎉 ${event.title} — ${event.subtitle}!\n\n📅 ${formatEventDate(event.date)}\n⏰ 5PM ${event.endTime}\n📍 ${event.venue}\n🎟 ${event.ticketPrices.map((t) => `${t.label}: ₦${t.price.toLocaleString()}`).join(" | ")}\n\nReserve: ${event.contactNumbers[0]}\n\n${event.hashtags.join(" ")}\n\n${shareUrl}`;

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `${event.title} — ${event.subtitle}`, text: shareText, url: shareUrl }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(shareText); } catch {}
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const whatsappReserve = `https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(`Hi, I'd like to reserve a table for ${event.title} — ${event.subtitle} on ${formatEventDate(event.date)}`)}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const twitterShare = `https://x.com/intent/tweet?text=${encodeURIComponent(`💦 ${event.title} — ${event.subtitle}! ${formatEventDate(event.date)} @ ODM Groove, Ijoko 🔥 ${event.hashtags.slice(0, 4).join(" ")}\n\n`)}${encodeURIComponent(shareUrl)}`;

  return (
    <main className="min-h-screen bg-[var(--black)] text-[var(--off-white)]">
      {/* Hero banner */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, #0a0a0a 0%, ${event.accentColor}22 100%)` }}>
        <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(ellipse at 30% 50%, ${event.accentColor}, transparent 70%)` }} />
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 relative z-10">
          <Link href="/#events" className="inline-flex items-center gap-2 text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors text-sm mb-8">
            <ArrowLeft size={16} /> Back to ODM Groove
          </Link>

          {/* Two-column hero: info left, poster right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border" style={{ color: event.accentColor, borderColor: `${event.accentColor}50`, background: `${event.accentColor}15` }}>
                  {event.status === "upcoming" ? "Upcoming" : event.status === "live" ? "🔴 Live Now" : event.status}
                </span>
                {event.ageLimit && <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--warm-gray)] text-xs font-medium">{event.ageLimit}+ Only</span>}
              </div>
              {event.artists && <p className="text-[var(--warm-gray)] text-sm tracking-[0.3em] uppercase mb-3">{event.artists.join(" × ")} presents</p>}
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-none mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                {event.title}
              </h1>
              <h2 className="font-display text-3xl md:text-4xl font-bold italic mb-8" style={{ fontFamily: "Playfair Display, serif", color: event.accentColor }}>
                {event.subtitle}
              </h2>
              {/* Countdown */}
              {!countdown.expired && (
                <div className="flex items-center gap-4 mb-8">
                  {[{ v: countdown.days, l: "Days" }, { v: countdown.hours, l: "Hrs" }, { v: countdown.minutes, l: "Min" }, { v: countdown.seconds, l: "Sec" }].map(({ v, l }, i) => (
                    <div key={l} className="flex items-center gap-4">
                      {i > 0 && <span className="text-[var(--gold)] text-2xl font-bold">:</span>}
                      <div className="text-center">
                        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded px-4 py-3 min-w-[64px] text-center">
                          <span className="font-display text-3xl font-bold tabular-nums" style={{ fontFamily: "Playfair Display, serif", color: event.accentColor }}>{String(v).padStart(2, "0")}</span>
                        </div>
                        <span className="text-[var(--warm-gray)] text-[10px] uppercase tracking-widest mt-1 block">{l}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <a href={whatsappReserve} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 mr-3">
                <Ticket size={16} /> Reserve Now
              </a>
              <button onClick={handleShare} className="btn-ghost inline-flex items-center gap-2">
                <Share2 size={16} /> {copied ? "Copied! 🔥" : "Share"}
              </button>
            </div>

            {/* Event Poster / Flyer */}
            {(event.posterImage || event.image) && (
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-2xl opacity-20 blur-xl"
                  style={{ background: event.accentColor }}
                />
                <div className="relative rounded-xl overflow-hidden border-2 shadow-2xl" style={{ borderColor: `${event.accentColor}40` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.posterImage || event.image}
                    alt={`${event.title} — ${event.subtitle} event poster`}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: 520 }}
                  />
                  {/* Save/Share overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-300 flex items-end opacity-0 hover:opacity-100">
                    <div className="w-full p-4 flex gap-3">
                      <a
                        href={event.image}
                        download
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:bg-white/30 transition-all"
                      >
                        📥 Save Poster
                      </a>
                      <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-sm text-white border border-white/20 hover:bg-white/30 transition-all"
                        style={{ background: `${event.accentColor}60` }}
                      >
                        📤 Share Event
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[var(--warm-gray)] text-xs mt-3 opacity-60">Hover poster to save or share</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h3 className="font-display text-2xl font-bold text-[var(--off-white)] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>About this event</h3>
            <p className="text-[var(--warm-gray)] leading-relaxed text-base">{event.longDescription}</p>
          </div>
          {event.extras && (
            <div>
              <h3 className="font-display text-xl font-bold text-[var(--off-white)] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>What to expect</h3>
              <div className="space-y-3">
                {event.extras.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 text-[var(--warm-gray)]">
                    <CheckCircle size={16} className="text-[var(--gold)] flex-shrink-0" /> {e}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Share section */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm p-6">
            <h3 className="font-bold text-[var(--off-white)] mb-2">Drag your crew in 🔥</h3>
            <p className="text-[var(--warm-gray)] text-sm mb-5">Share this event and let's fill the pool!</p>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappShare} target="_blank" rel="noopener noreferrer" className="btn-gold flex items-center gap-2 text-sm py-2 px-4">📲 WhatsApp</a>
              <a href={twitterShare} target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center gap-2 text-sm py-2 px-4">🐦 X / Twitter</a>
              <button onClick={handleShare} className="btn-ghost flex items-center gap-2 text-sm py-2 px-4">🔗 {copied ? "Copied!" : "Copy Link"}</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {event.hashtags.map((tag) => <span key={tag} className="text-xs text-[var(--warm-gray)]">{tag}</span>)}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket prices */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm overflow-hidden">
            <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${event.accentColor}, transparent)` }} />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-5"><Ticket size={14} className="text-[var(--gold)]" /><span className="text-[var(--gold)] text-xs uppercase tracking-[0.25em] font-semibold">Ticket Prices</span></div>
              {event.ticketPrices.map((t) => (
                <div key={t.label} className="flex justify-between items-center py-3 border-b border-[var(--dark-border)] last:border-0">
                  <span className="text-[var(--off-white)] font-medium">{t.label}</span>
                  <span className="font-display text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: event.accentColor }}>₦{t.price.toLocaleString()}</span>
                </div>
              ))}
              <a href={whatsappReserve} target="_blank" rel="noopener noreferrer" className="btn-gold w-full flex items-center justify-center gap-2 mt-6 text-sm">Reserve Your Spot</a>
            </div>
          </div>

          {/* Event details */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm p-6 space-y-4">
            <div className="flex items-start gap-3"><Calendar size={16} className="text-[var(--gold)] flex-shrink-0 mt-0.5" /><div><p className="text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Date</p><p className="text-[var(--off-white)] text-sm font-medium">{formatEventDate(event.date)}</p></div></div>
            <div className="flex items-start gap-3"><Clock size={16} className="text-[var(--gold)] flex-shrink-0 mt-0.5" /><div><p className="text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Time</p><p className="text-[var(--off-white)] text-sm font-medium">5PM {event.endTime}</p></div></div>
            <div className="flex items-start gap-3"><MapPin size={16} className="text-[var(--gold)] flex-shrink-0 mt-0.5" /><div><p className="text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Venue</p><p className="text-[var(--off-white)] text-sm font-medium">{event.venue}</p></div></div>
          </div>

          {/* Contact */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm p-6">
            <div className="flex items-center gap-2 mb-4"><Phone size={14} className="text-[var(--gold)]" /><span className="text-[var(--gold)] text-xs uppercase tracking-[0.25em] font-semibold">Reservations</span></div>
            {event.contactNumbers.map((num) => (
              <a key={num} href={`tel:+234${num.replace(/^0/, "")}`} className="block text-[var(--off-white)] font-semibold text-lg hover:text-[var(--gold)] transition-colors mb-1">{num}</a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
