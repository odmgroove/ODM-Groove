"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Wifi, Coffee, Tv, Waves, Check, ArrowRight, BedDouble, ChevronLeft, ChevronRight,
} from "lucide-react";

type Room = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string;   // comma-separated (new) or JSON array (old)
  image: string | null;
  capacity: number;
  available: boolean;
};

// Map amenities from strings to their appropriate icons
const getIcon = (label: string) => {
  if (label.toLowerCase().includes("wifi") || label.toLowerCase().includes("internet")) return Wifi;
  if (label.toLowerCase().includes("breakfast") || label.toLowerCase().includes("coffee")) return Coffee;
  if (label.toLowerCase().includes("tv") || label.toLowerCase().includes("netflix")) return Tv;
  if (label.toLowerCase().includes("pool")) return Waves;
  if (label.toLowerCase().includes("bed")) return BedDouble;
  return Check;
};

type ProcessedRoom = Room & {
  slug: string;
  tagline: string;
  currency: string;
  unit: string;
  parsedImages: { src: string; alt: string }[];
  parsedFeatures: string[];
  parsedAmenities: { icon: any; label: string }[];
  badge: string | null;
  badgeColor: string;
};

function RoomDisplay({ room }: { room: ProcessedRoom }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    setActiveImage(0);
    const timeout = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timeout);
  }, [room.id]);

  if (!room.parsedImages || room.parsedImages.length === 0) return null;

  // Clamp index to prevent out-of-bounds crash when switching between rooms
  // with different gallery sizes (e.g. 50k→30k while viewing photo 5)
  const safeIndex = Math.min(activeImage, room.parsedImages.length - 1);

  return (
    <article
      className={`glass-card rounded-sm overflow-hidden h-full flex flex-col transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
      aria-label={`${room.name} - ${room.currency}${room.price.toLocaleString()} per ${room.unit}`}
      itemScope
      itemType="https://schema.org/HotelRoom"
    >
      {/* Image gallery */}
      <div className="relative aspect-[4/3] md:aspect-auto md:h-[400px] lg:h-[450px] w-full shrink-0 group overflow-hidden bg-black/50">
        <Image
          src={room.parsedImages[safeIndex].src}
          alt={room.parsedImages[safeIndex].alt || room.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
          itemProp="image"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Thumbnail strip */}
        {room.parsedImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 w-max max-w-[90%] overflow-x-auto scrollbar-hide">
            {room.parsedImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-14 h-10 md:w-16 md:h-12 rounded-sm overflow-hidden border-2 transition-all shrink-0 ${
                  i === safeIndex ? "border-[var(--gold)] scale-110 shadow-lg" : "border-white/40 hover:border-white/80"
                }`}
                aria-label={`View image ${i + 1} of ${room.name}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || room.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-6 md:p-8 lg:p-10 flex flex-col grow bg-[#0a0a0a]">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
          <div>
            <p className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase font-medium mb-2">
              {room.tagline}
            </p>
            <h3
              className="font-display text-3xl lg:text-4xl font-bold text-[var(--off-white)]"
              style={{ fontFamily: "Playfair Display, serif" }}
              itemProp="name"
            >
              {room.name}
            </h3>
          </div>
          <div className="text-left md:text-right shrink-0 bg-[var(--dark)] px-4 py-3 rounded-sm border border-[var(--dark-border)]">
            <p className="text-[var(--warm-gray)] text-[10px] uppercase tracking-wider mb-0.5">Starting From</p>
            <p className="text-[var(--gold)] font-bold text-2xl lg:text-3xl" itemProp="priceRange">
              {room.currency}{room.price.toLocaleString()}
            </p>
            <p className="text-[var(--warm-gray)] text-xs">per {room.unit}</p>
          </div>
        </div>

        <p className="text-[var(--warm-gray)] text-sm leading-relaxed mb-8" itemProp="description">
          {room.description}
        </p>

        {/* Key amenities */}
        {room.parsedAmenities.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {room.parsedAmenities.map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-[var(--off-white)]/80 bg-[var(--black)] p-3 rounded-sm border border-[var(--dark-border)]/50">
                <Icon size={16} className="text-[var(--gold)] shrink-0" />
                <span className="text-xs font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        {room.parsedFeatures.length > 0 && (
          <div className="border-t border-[var(--dark-border)] pt-6 mb-8 mt-auto">
            <p className="text-[var(--warm-gray)] text-[10px] font-bold uppercase tracking-[0.15em] mb-4">Room Features</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-4">
              {room.parsedFeatures.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[var(--off-white)]/70">
                  <Check size={12} className="text-[var(--gold)] shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => (window as any).dispatchEvent(new CustomEvent('open-booking-modal', { detail: room.id }))}
          className="btn-gold w-full py-4 flex items-center justify-center gap-2 text-center text-sm tracking-[0.15em] uppercase font-bold mt-auto"
          aria-label={`Book ${room.name} at ODM Groove Hotel`}
        >
          Book {room.name} Now
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default function RoomsSection() {
  const [rooms, setRooms] = useState<ProcessedRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ProcessedRoom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/rooms");
        if (res.ok) {
          const data: Room[] = await res.json();
          const activeRooms = data.filter(r => r.available);
          
          const processed: ProcessedRoom[] = activeRooms.map(room => {
            // Support both old JSON-array format and new comma-separated format
            const parsedFeatures: string[] = (() => {
              if (!room.features) return [];
              try {
                const parsed = JSON.parse(room.features);
                if (Array.isArray(parsed)) return parsed.map((f: any) => String(f).trim());
              } catch {}
              return room.features.split(',').map(f => f.trim()).filter(Boolean);
            })();
            
            // Generate amenities dynamically from features since schema doesn't have an amenities field
            const parsedAmenities = parsedFeatures
              .filter(f => /wifi|internet|breakfast|coffee|tv|netflix|pool|bed/i.test(f))
              .map(label => ({
                icon: getIcon(label),
                label
              }));
            
            // Derive full gallery from price tier to use all available room photos
            const GALLERY_MAP: Record<string, { src: string; alt: string }[]> = {
              "30k": [
                { src: "/Room/odm-groove-hotel-room-30k-1.jpg", alt: `${room.name} - Bedroom View` },
                { src: "/Room/odm-groove-hotel-room-30k-2.jpg", alt: `${room.name} - Room Interior` },
                { src: "/Room/odm-groove-hotel-room-30k-toilet-1.jpg", alt: `${room.name} - Bathroom` },
                { src: "/Room/odm-groove-hotel-room-30k-toilet-2.jpg", alt: `${room.name} - Bathroom Detail` },
              ],
              "40k": [
                { src: "/Room/odm-groove-hotel-room-40k-1.jpg", alt: `${room.name} - Bedroom View` },
                { src: "/Room/odm-groove-hotel-room-40k-2.jpg", alt: `${room.name} - Room Interior` },
                { src: "/Room/odm-groove-hotel-room-40k-toilet-1.jpg", alt: `${room.name} - Bathroom` },
                { src: "/Room/odm-groove-hotel-room-40k-toilet-2.jpg", alt: `${room.name} - Bathroom Detail` },
              ],
              "50k": [
                { src: "/Room/odm-groove-hotel-room-50k-1.jpg", alt: `${room.name} - Bedroom View` },
                { src: "/Room/odm-groove-hotel-room-50k-2.jpg", alt: `${room.name} - Room Interior` },
                { src: "/Room/odm-groove-hotel-room-50k-3.jpg", alt: `${room.name} - Lounge Area` },
                { src: "/Room/odm-groove-hotel-room-50k-4.jpg", alt: `${room.name} - Suite Detail` },
                { src: "/Room/odm-groove-hotel-room-50k-5.jpg", alt: `${room.name} - Premium Furnishings` },
                { src: "/Room/odm-groove-hotel-room-50k-toilet-1.jpg", alt: `${room.name} - Luxury Bathroom` },
              ],
            };
            const tier = room.price <= 30000 ? "30k" : room.price <= 40000 ? "40k" : "50k";
            const parsedImages = GALLERY_MAP[tier];
            
            return {
              ...room,
              slug: `${room.name.toLowerCase().replace(/ /g, '-')}-room-ijoko-nigeria`,
              tagline: (room.price <= 30000) ? "A Home Away from Home" : "The Ultimate Staycation",
              currency: "₦",
              unit: "night",
              parsedImages,
              parsedFeatures,
              parsedAmenities,
              badge: (room.name.toLowerCase().includes("cedar") || room.name.toLowerCase().includes("rosewood")) 
                ? "Most Popular" 
                : room.name.toLowerCase().includes("cherry") 
                  ? "Best Value" 
                  : null,
              badgeColor: (room.price <= 30000) ? "bg-[var(--gold)]" : "bg-emerald-700",
            };
          });

          setRooms(processed);
          if (processed.length > 0) setActiveRoom(processed[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-[var(--black)] flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--gold)]"></div>
      </section>
    );
  }

  if (rooms.length === 0 || !activeRoom) return null;

  return (
    <section
      id="rooms"
      className="relative section-padding bg-[var(--black)] overflow-hidden"
      aria-labelledby="rooms-heading"
      itemScope
      itemType="https://schema.org/LodgingBusiness"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--gold)]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--gold)]/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[var(--gold)]/60" />
            <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
              Accommodations
            </span>
            <div className="h-px w-10 bg-[var(--gold)]/60" />
          </div>
          <h2
            id="rooms-heading"
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--off-white)] mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            The <span className="gradient-text italic">Master Suite</span> Collection
          </h2>
          <p className="text-[var(--warm-gray)] max-w-2xl mx-auto text-base leading-relaxed">
            Select an accommodation from our interactive showcase. Every room includes complimentary breakfast, high-speed WiFi, and premium entertainment.
          </p>
        </div>

        {/* Master Detail Interface */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 xl:gap-12 w-full">
          
          {/* Room Selector (List / Tabs) */}
          <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 flex flex-col z-20">
            <div className="hidden lg:flex items-center gap-3 mb-6 pb-4 border-b border-[var(--dark-border)]">
              <span className="text-[var(--off-white)] font-display text-2xl" style={{ fontFamily: "Playfair Display, serif" }}>
                Our Rooms
              </span>
              <span className="bg-[var(--gold)]/10 text-[var(--gold)] text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                {rooms.length} Suites
              </span>
            </div>
            
            {/* Mobile: Horizontal scroll, Desktop: Vertical List */}
            <div 
              className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-4 lg:pb-0 snap-x snap-mandatory w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Hide webkit scrollbar for elegant UI */}
              <style dangerouslySetInnerHTML={{__html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
              `}} />

              {rooms.map((room) => {
                const isActive = activeRoom.id === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room)}
                    className={`shrink-0 w-[240px] md:w-[280px] lg:w-full snap-start text-left px-5 lg:px-6 py-4 lg:py-5 rounded-sm transition-all duration-300 flex flex-col items-start justify-center border group ${
                      isActive 
                        ? "bg-gradient-to-r from-[var(--gold)]/10 to-transparent border-[var(--gold)]/40 shadow-[inset_4px_0_0_0_var(--gold)]" 
                        : "bg-[var(--dark)] border-transparent hover:bg-white/5 hover:border-[var(--dark-border)]"
                    }`}
                  >
                    <div className="w-full flex justify-between items-center mb-1.5">
                      <p className={`font-bold text-base lg:text-lg transition-colors ${isActive ? "text-[var(--gold)]" : "text-[var(--off-white)] group-hover:text-white"}`}>
                        {room.name}
                      </p>
                      {room.badge && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${isActive ? "bg-[var(--gold)] text-black" : "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20"}`}>
                          {room.badge}
                        </span>
                      )}
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <p className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "text-[var(--warm-gray)]"}`}>
                        {room.currency}{room.price.toLocaleString()}
                        <span className="text-[10px] opacity-70 ml-1 font-normal">/night</span>
                      </p>
                      <ArrowRight size={14} className={`transition-all duration-300 ${isActive ? "text-[var(--gold)] opacity-100 translate-x-0" : "text-[var(--warm-gray)] opacity-0 -translate-x-2 group-hover:opacity-50"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Room Display Area */}
          <div className="w-full grow min-w-0 flex flex-col">
            <RoomDisplay room={activeRoom} />
          </div>
        </div>
      </div>
    </section>
  );
}
