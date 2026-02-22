"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Calendar, BedDouble, Coffee, Wifi, Waves, PartyPopper } from "lucide-react";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
      aria-label="ODM Groove Hotel hero - Where Luxury Meets Affordability"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/odm-groove-hotel-exterior-daytime.jpg"
        onCanPlayThrough={() => setVideoLoaded(true)}
        aria-label="ODM Groove Hotel overview video"
      >
        <source src="/odm-groove-hotel-overview.mp4" type="video/mp4" />
      </video>

      {/* Fallback Image (while video loads) */}
      {!videoLoaded && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/odm-groove-hotel-exterior-daytime.jpg"
          alt="ODM Groove Hotel exterior view - Ijoko Ogbayo, Ogun State"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Multi-layer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/85 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent z-10" />

      {/* Decorative gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent z-20" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-5 md:px-8">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Eyebrow label */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-[var(--gold)]/60" />
            <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
              Ijoko Ogbayo · Ogun State · Nigeria
            </span>
            <div className="h-px w-10 bg-[var(--gold)]/60" />
          </div>

          {/* Main Heading */}
          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 text-white"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Where Luxury Meets{" "}
            <span className="gradient-text italic">Affordability</span>
          </h1>

          {/* Subheadline */}
          <p className="text-[var(--off-white)]/80 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8 font-light">
            Experience modern comfort at ODM Groove — a premium boutique hotel
            and event hall nestled in the heart of Ijoko Ogbayo. Your gateway
            to relaxation, just minutes from Lagos.
          </p>

          {/* Price chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
              <BedDouble size={14} className="text-[var(--gold)]" />
              <span className="text-[var(--off-white)]/80">Standard from</span>
              <span className="text-[var(--gold)] font-semibold">₦30,000</span>
              <span className="text-[var(--off-white)]/50">/night</span>
            </div>
            <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
              <BedDouble size={14} className="text-[var(--gold)]" />
              <span className="text-[var(--off-white)]/80">Deluxe from</span>
              <span className="text-[var(--gold)] font-semibold">₦50,000</span>
              <span className="text-[var(--off-white)]/50">/night</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection("rooms")}
              className="btn-gold w-full sm:w-auto flex items-center justify-center gap-2"
              aria-label="Explore our hotel rooms"
            >
              <BedDouble size={16} />
              Explore Rooms
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="btn-ghost w-full sm:w-auto flex items-center justify-center gap-2"
              aria-label="Book our event hall"
            >
              <Calendar size={16} />
              Book an Event
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--off-white)]/40 hover:text-[var(--gold)] transition-colors group"
          aria-label="Scroll down to learn more"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Scroll</span>
          <ChevronDown
            size={20}
            className="animate-bounce group-hover:text-[var(--gold)]"
          />
        </button>
      </div>

      {/* Feature bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 hidden md:block bg-black/70 backdrop-blur-md border-t border-[var(--dark-border)]">
        <div className="max-w-7xl mx-auto px-8 py-3 grid grid-cols-4 gap-4 text-center">
          {[
            { icon: <Coffee size={16} />, label: "Free Breakfast" },
            { icon: <Wifi size={16} />, label: "High-Speed WiFi" },
            { icon: <Waves size={16} />, label: "Swimming Pool" },
            { icon: <PartyPopper size={16} />, label: "Event Hall" },
          ].map((feat) => (
            <div key={feat.label} className="flex items-center justify-center gap-2 text-xs text-[var(--off-white)]/60">
              <span className="text-[var(--gold)]">{feat.icon}</span>
              <span className="tracking-wide">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
