"use client";

import { useState } from "react";
import Image from "next/image";
import { Coffee, Waves, Music, ArrowRight, Play, CirclePlay } from "lucide-react";

const amenities = [
  {
    id: "pool",
    title: "Outdoor Swimming Pool",
    description: "Take a refreshing dip in our pristine outdoor pool, surrounded by comfortable loungers perfect for soaking up the Nigerian sun.",
    icon: Waves,
    image: "/odm-groove-swimming-pool.mp4",
    isVideo: true,
  },
  {
    id: "club",
    title: "ODM Nightclub",
    description: "The heartbeat of ODM Groove's nightlife. State-of-the-art sound systems and top DJs guarantee an unforgettable weekend vibe.",
    icon: Music,
    image: "/odm-groove-club-nightlife.mp4",
    isVideo: true,
  },
  {
    id: "bar",
    title: "Rooftop & VIP Lounge",
    description: "Experience premium mixology and curated spirits with breathtaking sunset views over Ijoko at our exclusive rooftop bar.",
    icon: Coffee,
    image: "/Bar/odm-groove-rooftop-bar-view-1.jpg",
    isVideo: false,
  },
  {
    id: "sports",
    title: "Sports & Leisure",
    description: "Challenge your friends to a game of snooker or relax in our outdoor leisure area designed for complete entertainment.",
    icon: Play,
    image: "/odm-groove-sports-leisure-facilities.mp4",
    isVideo: true,
  },
];

export default function AmenitiesSection() {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <section
      id="amenities"
      className="relative py-24 bg-[var(--dark)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[var(--gold)]/60" />
            <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
              Facilities
            </span>
            <div className="h-px w-10 bg-[var(--gold)]/60" />
          </div>
          <h2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--off-white)] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            World-Class <span className="gradient-text italic">Amenities</span>
          </h2>
          <p className="text-[var(--warm-gray)] max-w-xl mx-auto text-base leading-relaxed">
            From relaxation to vibrant nightlife, ODM Groove offers everything you need for a memorable stay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Column - Content */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4 pt-">
              {amenities.map((item, idx) => {
                const isActive = activeItem === idx;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveItem(idx)}
                    className={`w-full text-left p-5 rounded-sm border transition-all duration-300 flex gap-4 ${
                      isActive
                        ? "bg-[var(--gold)]/5 border-[var(--gold)]/50"
                        : "bg-transparent border-[var(--dark-border)] hover:border-[var(--gold)]/20"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-sm shrink-0 transition-colors ${
                        isActive ? "bg-[var(--gold)] text-black" : "bg-[#1a1a1a] text-[var(--gold)]"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 transition-colors ${isActive ? "text-[var(--gold)]" : "text-[var(--off-white)]"}`}>
                        {item.title}
                      </h3>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isActive ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-[var(--warm-gray)] text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4">
              <a
                href="#gallery"
                className="inline-flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-light)] font-medium text-sm tracking-wide transition-colors group"
              >
                View Full Gallery
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column - Media Viewer */}
          <div className="lg:col-span-7 h-[500px] lg:h-[700px] relative rounded-sm overflow-hidden border border-[var(--gold)]/20 shadow-2xl group">
            {amenities.map((item, idx) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  activeItem === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {item.isVideo ? (
                  <video
                    src={item.image}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                
                {/* Now Playing Badge for Videos */}
                {item.isVideo && (
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                    <CirclePlay size={12} className="text-[var(--gold)]" />
                    <span className="text-[10px] uppercase tracking-widest font-medium text-white/80">Playing</span>
                  </div>
                )}
                
                {/* Media caption */}
                <div className={`absolute bottom-8 left-8 right-8 transition-transform duration-700 delay-300 ${activeItem === idx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <p className="font-display text-3xl font-bold text-white mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                    {item.title}
                  </p>
                  <div className="w-16 h-1 bg-[var(--gold)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}