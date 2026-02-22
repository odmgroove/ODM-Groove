"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Shield, Star, Users, Building2 } from "lucide-react";

const stats = [
  { icon: Building2, value: 2024, suffix: "", label: "Est. Year", prefix: "" },
  { icon: Users, value: 200, suffix: "+", label: "Event Capacity", prefix: "" },
  { icon: Star, value: 4.7, suffix: "", label: "Guest Rating", prefix: "" },
  { icon: Shield, value: 24, suffix: "/7", label: "Security", prefix: "" },
];

function AnimatedCounter({
  target,
  suffix,
  prefix,
  isFloat,
}: {
  target: number;
  suffix: string;
  prefix: string;
  isFloat: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const duration = 1800;
          const start = Date.now();
          const step = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(isFloat ? parseFloat((eased * target).toFixed(1)) : Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, isFloat]);

  return (
    <span ref={ref}>
      {prefix}{isFloat ? current.toFixed(1) : current}{suffix}
    </span>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative section-padding bg-[var(--dark)] overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold)]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--gold)]/2 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[var(--gold)]/60" />
            <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
              Our Story
            </span>
            <div className="h-px w-10 bg-[var(--gold)]/60" />
          </div>
          <h2
            id="about-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--off-white)] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            A New Standard of{" "}
            <span className="gradient-text italic">Hospitality</span>
          </h2>
          <p className="text-[var(--warm-gray)] max-w-xl mx-auto text-base leading-relaxed">
            Born from a passion to redefine comfort near Lagos.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Image column */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden image-overlay-hover">
              <Image
                src="/odm-groove-hotel-exterior-daytime.jpg"
                alt="ODM Groove Hotel exterior - premium boutique hotel in Ijoko Ogbayo, Ogun State"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-4 md:-right-8 glass-card px-6 py-4 text-center shadow-2xl border border-[var(--gold)]/25">
              <p className="text-[var(--gold)] font-display text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
                RC-7450366
              </p>
              <p className="text-[var(--warm-gray)] text-xs tracking-wider mt-1 uppercase">
                CAC Registered
              </p>
            </div>
          </div>

          {/* Text column */}
          <div className="space-y-6">
            <div className="gold-divider mb-6" />
            <h3
              className="font-display text-2xl md:text-3xl font-semibold text-[var(--off-white)]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Your Gateway to Relaxation in Ijoko, Ogun State
            </h3>
            <p className="text-[var(--warm-gray)] leading-relaxed text-base">
              Established in 2024, ODM Groove Limited was built on a simple belief:
              that premium hospitality should be accessible to everyone. Nestled on
              Shonekan Street, Ola-Oparun in Ijoko Ogbayo — just minutes from
              Lagos — we bring you a sanctuary where modern comfort and
              warm Nigerian hospitality converge.
            </p>
            <p className="text-[var(--warm-gray)] leading-relaxed text-base">
              Whether you&apos;re here for a relaxing staycation, a business trip, or
              planning a grand event, ODM Groove offers an unparalleled experience
              with world-class amenities at truly competitive prices.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Free daily breakfast included with every room",
                "High-speed WiFi & Smart TVs with Netflix & DSTV",
                "Outdoor swimming pool, rooftop bar & VIP lounge",
                "Versatile event hall for up to 200+ guests",
                "24/7 security with secure on-site parking",
                "10% discount for stays of 3 nights or more",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="mt-1 w-4 h-4 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)] flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                  </div>
                  <span className="text-[var(--off-white)]/80 text-sm leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  const el = document.getElementById("rooms");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-gold"
              >
                View Our Rooms
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, suffix, label, prefix }) => (
            <div
              key={label}
              className="glass-card text-center p-6 rounded-sm border border-[var(--dark-border)] hover:border-[var(--gold)]/30 transition-colors"
            >
              <Icon size={22} className="text-[var(--gold)] mx-auto mb-3" />
              <p
                className="font-display text-3xl font-bold text-[var(--off-white)] mb-1"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <AnimatedCounter
                  target={value}
                  suffix={suffix}
                  prefix={prefix}
                  isFloat={String(value).includes(".")}
                />
              </p>
              <p className="text-[var(--warm-gray)] text-xs tracking-wider uppercase">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
