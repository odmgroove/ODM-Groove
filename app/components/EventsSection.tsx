"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Share2,
  Phone,
  ArrowRight,
  Users,
  Music,
  Wine,
  Car,
  Flame,
  CheckCircle,
} from "lucide-react";
import {
  getFeaturedEvent,
  getUpcomingEvents,
  formatEventDate,
  getCategoryLabel,
  type Event,
} from "../lib/eventsData";
import NotifyMeWidget from "./NotifyMeWidget";

function useCountdown(targetDate: string) {
  const calcTime = () => {
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
  const [time, setTime] = useState(calcTime);
  useEffect(() => {
    const id = setInterval(() => setTime(calcTime()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <div className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm px-3 py-3 text-center mb-1">
        <span className="font-display text-3xl md:text-4xl font-bold text-[var(--gold)] tabular-nums" style={{ fontFamily: "Playfair Display, serif" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[var(--warm-gray)] text-[10px] uppercase tracking-[0.2em] font-medium">{label}</span>
    </div>
  );
}

function FeaturedEventHero({ event }: { event: Event }) {
  const countdown = useCountdown(event.date);
  const [copied, setCopied] = useState(false);

  const shareText = `🎉 ${event.title} — ${event.subtitle}!\n\n📅 ${formatEventDate(event.date)}\n📍 ${event.venue}\n🎟 ${event.ticketPrices.map((t) => `${t.label}: ₦${t.price.toLocaleString()}`).join(" | ")}\n\nReserve: ${event.contactNumbers[0]}\n\n${event.hashtags.join(" ")}\n\nhttps://odmgroove.vercel.app/#events`;

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `${event.title} — ${event.subtitle}`, text: shareText, url: "https://odmgroove.vercel.app/#events" }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(shareText); } catch {}
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const whatsappUrl = `https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(`Hi, I'd like to reserve a table for the ${event.title} ${event.subtitle} on ${formatEventDate(event.date)}`)}`;

  return (
    <div className="relative rounded-sm overflow-hidden border border-[var(--dark-border)] mb-16">
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${event.accentColor}, transparent)` }} />
      <div className="relative bg-[var(--dark-card)] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at top left, ${event.accentColor} 0%, transparent 60%), radial-gradient(ellipse at bottom right, ${event.accentColor}80 0%, transparent 60%)` }} />
        <div className="relative z-10 px-6 py-10 md:px-12 md:py-14">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] text-xs font-semibold uppercase tracking-wider">
              <Flame size={12} /> Featured Event
            </span>
            {event.ageLimit && (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--warm-gray)] text-xs font-medium">{event.ageLimit}+ Only</span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--warm-gray)] text-xs font-medium uppercase tracking-wider">{getCategoryLabel(event.category)}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              {event.artists && (
                <p className="text-[var(--warm-gray)] text-xs tracking-[0.3em] uppercase font-medium mb-3">{event.artists.join(" × ")} presents</p>
              )}
              <h2 className="font-display text-4xl md:text-5xl xl:text-6xl font-bold text-[var(--off-white)] leading-tight mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                {event.title}
              </h2>
              <h3 className="font-display text-2xl md:text-3xl font-bold italic mb-6" style={{ fontFamily: "Playfair Display, serif", color: event.accentColor }}>
                {event.subtitle}
              </h3>
              <p className="text-[var(--warm-gray)] text-base leading-relaxed mb-8 max-w-lg">{event.longDescription}</p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-[var(--off-white)]/80">
                  <Calendar size={16} className="text-[var(--gold)] flex-shrink-0" />
                  <span>{formatEventDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--off-white)]/80">
                  <Clock size={16} className="text-[var(--gold)] flex-shrink-0" />
                  <span>5PM {event.endTime}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[var(--off-white)]/80">
                  <MapPin size={16} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
                  <span>{event.venue}</span>
                </div>
              </div>

              {event.extras && (
                <div className="space-y-2 mb-8">
                  {event.extras.map((extra, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[var(--warm-gray)]">
                      <CheckCircle size={14} className="text-[var(--gold)] flex-shrink-0" /> {extra}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-gold flex items-center justify-center gap-2 group">
                  <Ticket size={16} /> Reserve Your Spot
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </a>
                <button onClick={handleShare} className="btn-ghost flex items-center justify-center gap-2 relative">
                  <Share2 size={16} /> {copied ? "Copied! Share it 🔥" : "Share Event"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {!countdown.expired && (
                <div>
                  <p className="text-[var(--warm-gray)] text-xs uppercase tracking-[0.25em] font-medium mb-4">Countdown to the event</p>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CountdownBlock value={countdown.days} label="Days" />
                    <span className="text-[var(--gold)] text-3xl font-bold mt-2">:</span>
                    <CountdownBlock value={countdown.hours} label="Hours" />
                    <span className="text-[var(--gold)] text-3xl font-bold mt-2">:</span>
                    <CountdownBlock value={countdown.minutes} label="Mins" />
                    <span className="text-[var(--gold)] text-3xl font-bold mt-2">:</span>
                    <CountdownBlock value={countdown.seconds} label="Secs" />
                  </div>
                </div>
              )}

              <div className="bg-[var(--dark)] border border-[var(--dark-border)] rounded-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Ticket size={14} className="text-[var(--gold)]" />
                  <span className="text-[var(--gold)] text-xs uppercase tracking-[0.25em] font-semibold">Ticket Prices</span>
                </div>
                <div className="space-y-0">
                  {event.ticketPrices.map((t) => (
                    <div key={t.label} className="flex justify-between items-center py-3 border-b border-[var(--dark-border)] last:border-0 last:pb-0">
                      <span className="text-[var(--off-white)] font-medium">{t.label}</span>
                      <span className="font-display text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: event.accentColor }}>
                        ₦{t.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--dark)] border border-[var(--dark-border)] rounded-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone size={14} className="text-[var(--gold)]" />
                  <span className="text-[var(--gold)] text-xs uppercase tracking-[0.25em] font-semibold">Room & Table Reservations</span>
                </div>
                <div className="space-y-2">
                  {event.contactNumbers.map((num) => (
                    <a key={num} href={`tel:+234${num.replace(/^0/, "")}`} className="block text-[var(--off-white)] font-semibold text-lg hover:text-[var(--gold)] transition-colors">{num}</a>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {event.hashtags.map((tag) => (
                  <span key={tag} className="text-xs text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors cursor-default">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const whatsappUrl = `https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(`Hi, I'd like to get more info about ${event.title} on ${formatEventDate(event.date)}`)}`;
  return (
    <div className="group bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm overflow-hidden hover:border-[var(--gold)]/30 transition-all duration-300">
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${event.accentColor}, transparent)` }} />
      {/* Poster thumbnail */}
      {event.image && (
        <Link href={`/events/${event.id}`} className="block overflow-hidden relative h-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image}
            alt={`${event.title} poster`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-card)] via-transparent to-transparent" />
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--warm-gray)]">{getCategoryLabel(event.category)}</span>
          {event.ageLimit && <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-white/5 text-[var(--warm-gray)]">{event.ageLimit}+</span>}
        </div>
        <h3 className="font-display text-xl font-bold text-[var(--off-white)] mb-1" style={{ fontFamily: "Playfair Display, serif" }}>{event.title}</h3>
        {event.subtitle && <p className="text-sm font-medium mb-3" style={{ color: event.accentColor }}>{event.subtitle}</p>}
        <p className="text-[var(--warm-gray)] text-sm leading-relaxed mb-5 line-clamp-2">{event.description}</p>
        <div className="space-y-2 mb-5 text-xs text-[var(--warm-gray)]">
          <div className="flex items-center gap-2"><Calendar size={12} className="text-[var(--gold)]" />{formatEventDate(event.date)}</div>
          <div className="flex items-center gap-2"><Ticket size={12} className="text-[var(--gold)]" />{event.ticketPrices.map((t) => `${t.label}: ₦${t.price.toLocaleString()}`).join(" · ")}</div>
        </div>
        <div className="flex gap-3">
          <Link href={`/events/${event.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-[var(--off-white)] hover:text-[var(--gold)] transition-colors">
            View Event <ArrowRight size={14} />
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors ml-auto">
            Reserve →
          </a>
        </div>
      </div>
    </div>
  );
}
export default function EventsSection() {
  const featuredEvent = getFeaturedEvent();
  const upcomingEvents = getUpcomingEvents().filter((e) => !e.featured);

  return (
    <section id="events" className="relative section-padding bg-[var(--black)] overflow-hidden" aria-labelledby="events-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--gold)]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[var(--gold)]/60" />
            <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">Events & Experiences</span>
            <div className="h-px w-10 bg-[var(--gold)]/60" />
          </div>
          <h2 id="events-heading" className="font-display text-3xl md:text-5xl font-bold text-[var(--off-white)] leading-tight" style={{ fontFamily: "Playfair Display, serif" }}>
            What&apos;s <span className="gradient-text italic">Happening</span> at ODM Groove
          </h2>
        </div>

        {featuredEvent && <FeaturedEventHero event={featuredEvent} />}

        {upcomingEvents.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">More Coming Up</span>
              <div className="h-px flex-1 bg-[var(--dark-border)]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          </>
        )}

        {!featuredEvent && upcomingEvents.length === 0 && (
          <div className="text-center py-20 text-[var(--warm-gray)]">
            <Calendar size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">No upcoming events right now</p>
            <p className="text-sm mb-8">Be the first to know when the next one drops.</p>
            <div className="max-w-sm mx-auto">
              <NotifyMeWidget compact />
            </div>
          </div>
        )}

        {/* Notify Me strip — shown when there ARE upcoming events too */}
        {(featuredEvent || upcomingEvents.length > 0) && (
          <div className="mb-16 max-w-xl mx-auto">
            <NotifyMeWidget compact />
          </div>
        )}

        {/* ── Event Hall / Venue Rental ──────────────────────────────────────── */}
        <div className="mt-20 pt-16 border-t border-[var(--dark-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text — right on mobile (stacks below), left on desktop */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">The Venue</span>
                <div className="h-px w-10 bg-[var(--gold)]/60" />
              </div>
              <h2
                className="font-display text-3xl md:text-5xl font-bold text-[var(--off-white)] mb-6 leading-tight"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Host Unforgettable <br />
                <span className="gradient-text italic">Events &amp; Celebrations</span>
              </h2>
              <p className="text-[var(--warm-gray)] text-base leading-relaxed mb-8">
                Whether you are planning a dream wedding, a corporate seminar, or a grand birthday party,
                ODM Groove&apos;s expansive event hall is the perfect canvas for your celebration. With a capacity
                of over 200 guests and premium facilities, we guarantee a seamless experience.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { icon: Users, label: "200+ Capacity", desc: "Spacious seating" },
                  { icon: Car,   label: "Secure Parking", desc: "On-site security" },
                  { icon: Music, label: "Sound System",   desc: "Premium acoustics" },
                  { icon: Wine,  label: "Catering",        desc: "Available on request" },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--dark)] border border-[var(--dark-border)] flex items-center justify-center flex-shrink-0">
                      <feature.icon size={18} className="text-[var(--gold)]" />
                    </div>
                    <div>
                      <h4 className="text-[var(--off-white)] font-semibold text-sm mb-1">{feature.label}</h4>
                      <span className="text-[var(--warm-gray)] text-xs">{feature.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/2347061514120?text=I%20would%20like%20to%20inquire%20about%20booking%20the%20Event%20Hall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold flex items-center justify-center gap-2 group"
                >
                  Inquire Now
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Media Collage — visible on ALL screen sizes */}
            <div className="order-1 lg:order-2 relative h-[420px] sm:h-[500px] lg:h-[600px] w-full">
              {/* Back-large image */}
              <div className="absolute top-0 right-0 w-[80%] h-[80%] rounded-sm overflow-hidden shadow-2xl z-20 border border-[var(--dark-border)]">
                <Image
                  src="/Hall/odm-groove-event-hall-interior-view-1.jpg"
                  alt="ODM Groove event hall interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Front-small overlapping image */}
              <div className="absolute bottom-0 left-0 w-[60%] h-[50%] rounded-sm overflow-hidden shadow-2xl z-30 border-4 border-[var(--black)]">
                <Image
                  src="/Hall/odm-groove-event-hall-front-view.jpg"
                  alt="ODM Groove event hall front view"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Glow blob */}
              <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[var(--gold)]/20 rounded-full blur-2xl z-10" />

              {/* Decorative border frame */}
              <div className="absolute -z-10 -right-10 -bottom-10 w-full h-full border border-[var(--dark-border)] rounded-sm" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
