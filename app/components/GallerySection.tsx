"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

// Categorized assets
const mediaItems = [
  { id: 1, type: "video", src: "/odm-groove-hotel-overview.mp4", category: "all", title: "Hotel Overview", thumb: "/odm-groove-hotel-exterior-daytime.jpg" },
  { id: 2, type: "image", src: "/odm-groove-hotel-front-view.jpg", category: "exterior", title: "Front View" },
  { id: 3, type: "image", src: "/Room/odm-groove-hotel-room-30k-1.jpg", category: "rooms", title: "Standard Room 30K - 1" },
  { id: 4, type: "image", src: "/Room/odm-groove-hotel-room-30k-2.jpg", category: "rooms", title: "Standard Room 30K - 2" },
  { id: 50, type: "image", src: "/Room/odm-groove-hotel-room-30k-toilet-1.jpg", category: "rooms", title: "Standard Room 30K Toilet 1" },
  { id: 51, type: "image", src: "/Room/odm-groove-hotel-room-30k-toilet-2.jpg", category: "rooms", title: "Standard Room 30K Toilet 2" },
  { id: 52, type: "image", src: "/Room/odm-groove-hotel-room-40k-1.jpg", category: "rooms", title: "Deluxe Room 40K - 1" },
  { id: 53, type: "image", src: "/Room/odm-groove-hotel-room-40k-2.jpg", category: "rooms", title: "Deluxe Room 40K - 2" },
  { id: 54, type: "image", src: "/Room/odm-groove-hotel-room-40k-toilet-1.jpg", category: "rooms", title: "Deluxe Room 40K Toilet 1" },
  { id: 55, type: "image", src: "/Room/odm-groove-hotel-room-40k-toilet-2.jpg", category: "rooms", title: "Deluxe Room 40K Toilet 2" },
  { id: 56, type: "image", src: "/Room/odm-groove-hotel-room-50k-1.jpg", category: "rooms", title: "Master Suite 50K - 1" },
  { id: 57, type: "image", src: "/Room/odm-groove-hotel-room-50k-2.jpg", category: "rooms", title: "Master Suite 50K - 2" },
  { id: 58, type: "image", src: "/Room/odm-groove-hotel-room-50k-3.jpg", category: "rooms", title: "Master Suite 50K - 3" },
  { id: 59, type: "image", src: "/Room/odm-groove-hotel-room-50k-4.jpg", category: "rooms", title: "Master Suite 50K - 4" },
  { id: 60, type: "image", src: "/Room/odm-groove-hotel-room-50k-5.jpg", category: "rooms", title: "Master Suite 50K - 5" },
  { id: 61, type: "image", src: "/Room/odm-groove-hotel-room-50k-toilet-1.jpg", category: "rooms", title: "Master Suite 50K Toilet" },
  { id: 5, type: "video", src: "/odm-groove-swimming-pool.mp4", category: "amenities", title: "Swimming Pool", thumb: "/Room/odm-groove-hotel-room-40k-1.jpg" },
  { id: 6, type: "image", src: "/Bar/odm-groove-outdoor-bar-nigeria.jpg", category: "bar", title: "Outdoor Bar" },
  { id: 7, type: "image", src: "/Bar/odm-groove-rooftop-bar-view-1.jpg", category: "bar", title: "Rooftop Bar 1" },
  { id: 8, type: "image", src: "/Bar/odm-groove-rooftop-bar-view-2.jpg", category: "bar", title: "Rooftop Bar 2" },
  { id: 9, type: "image", src: "/Bar/odm-groove-rooftop-bar-view-3.jpg", category: "bar", title: "Rooftop Bar 3" },
  { id: 10, type: "image", src: "/Bar/odm-groove-vip-bar-lounge-1.jpg", category: "bar", title: "VIP Lounge 1" },
  { id: 11, type: "image", src: "/Bar/odm-groove-vip-bar-lounge-2.jpg", category: "bar", title: "VIP Lounge 2" },
  { id: 12, type: "image", src: "/Bar/odm-groove-vip-bar-lounge-3.jpg", category: "bar", title: "VIP Lounge 3" },
  { id: 13, type: "image", src: "/Bar/odm-groove-vip-bar-lounge-4.jpg", category: "bar", title: "VIP Lounge 4" },
  { id: 14, type: "video", src: "/Bar/odm-groove-bar-overview.mp4", category: "bar", title: "Bar Overview", thumb: "/Bar/odm-groove-rooftop-bar-view-3.jpg" },
  { id: 15, type: "image", src: "/Outdoor night view/odm-groove-nightlife-outdoor-1.jpg", category: "nightlife", title: "Nightlife 1" },
  { id: 16, type: "image", src: "/Outdoor night view/odm-groove-nightlife-outdoor-2.jpg", category: "nightlife", title: "Nightlife 2" },
  { id: 17, type: "image", src: "/Outdoor night view/odm-groove-nightlife-outdoor-3.jpg", category: "nightlife", title: "Nightlife 3" },
  { id: 18, type: "image", src: "/Outdoor night view/odm-groove-nightlife-outdoor-4.jpg", category: "nightlife", title: "Nightlife 4" },
  { id: 19, type: "video", src: "/Outdoor night view/odm-groove-nightlife-outdoor.mp4", category: "nightlife", title: "Nightlife Video", thumb: "/Outdoor night view/odm-groove-nightlife-outdoor-1.jpg" },
  { id: 20, type: "video", src: "/odm-groove-club-view.mp4", category: "nightlife", title: "Club Inside", thumb: "/Outdoor night view/odm-groove-nightlife-outdoor-2.jpg" },
  { id: 21, type: "video", src: "/odm-groove-sports-leisure-facilities.mp4", category: "amenities", title: "Sports Lounge", thumb: "/Bar/odm-groove-outdoor-bar-nigeria.jpg" },
  { id: 24, type: "image", src: "/Hall/odm-groove-event-hall-front-view.jpg", category: "hall", title: "Event Hall Front View" },
  { id: 25, type: "video", src: "/Hall/odm-groove-event-hall-full-view.mp4", category: "hall", title: "Event Hall Full View", thumb: "/Hall/odm-groove-event-hall-interior-view-1.jpg" },
  { id: 26, type: "video", src: "/Hall/odm-groove-event-hall-short-video.mp4", category: "hall", title: "Event Hall Quick Tour", thumb: "/Hall/odm-groove-event-hall-front-view.jpg" },
  { id: 27, type: "image", src: "/Hall/odm-groove-event-hall-interior-view-1.jpg", category: "hall", title: "Event Hall Interior 1" },
  { id: 28, type: "video", src: "/Hall/odm-groove-event-hall-with-guests.mp4", category: "hall", title: "Event Hall With Guests", thumb: "/Hall/odm-groove-event-hall-interior-view-2.jpg" },
  { id: 29, type: "image", src: "/Hall/odm-groove-event-hall-interior-view-2.jpg", category: "hall", title: "Event Hall Interior 2" },
];

const categories = ["all", "exterior", "rooms", "hall", "bar", "amenities", "nightlife"];

export default function GallerySection() {
  const [filter, setFilter] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // If filter is 'all' and not showing all, take only first 6
  let filteredItems = filter === "all" 
    ? mediaItems 
    : mediaItems.filter(item => item.category === filter);

  if (filter === "all" && !showAll) {
    filteredItems = filteredItems.slice(0, 6);
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <section id="gallery" className="relative section-padding bg-[var(--black)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[var(--gold)]/60" />
            <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
              Gallery
            </span>
            <div className="h-px w-10 bg-[var(--gold)]/60" />
          </div>
          <h2
            className="font-display text-3xl md:text-5xl font-bold text-[var(--off-white)] mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            A Glimpse of <span className="gradient-text italic">Elegance</span>
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                if (cat === "all") setShowAll(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === cat
                  ? "bg-[var(--gold)] text-black"
                  : "bg-white/5 text-[var(--warm-gray)] hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredItems.map((item, idx) => (
            <div 
              key={item.id} 
              className="relative break-inside-avoid rounded-sm overflow-hidden group cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              {item.type === "image" ? (
                <div className="relative hover:scale-105 transition-transform duration-700">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={500}
                    height={350}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : (
                <div className="relative group-hover:scale-105 transition-transform duration-700">
                  <Image
                    src={item.thumb || "/placeholder.jpg"}
                    alt={item.title}
                    width={500}
                    height={350}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--gold)]/90 flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                      <Play size={20} className="text-black fill-black" />
                    </div>
                  </div>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <span className="p-4 text-[var(--off-white)] font-medium text-sm">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {filter === "all" && !showAll && mediaItems.length > 6 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowAll(true)}
              className="btn-gold inline-flex items-center justify-center text-sm"
            >
              View All Gallery
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-[var(--gold)] text-white hover:text-black rounded-full transition-colors z-[110]"
          >
            <X size={24} />
          </button>

          <div className="relative w-full max-w-5xl aspect-video rounded-sm overflow-hidden shadow-2xl border border-[var(--dark-border)]">
            {filteredItems[currentIndex].type === "video" ? (
              <video 
                src={filteredItems[currentIndex].src} 
                className="w-full h-full object-contain"
                autoPlay 
                controls
                muted
              />
            ) : (
              <Image
                src={filteredItems[currentIndex].src}
                alt={filteredItems[currentIndex].title}
                fill
                className="object-contain"
              />
            )}
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white text-shadow-md">
              <h3 className="font-display text-2xl" style={{ fontFamily: "Playfair Display, serif" }}>
                {filteredItems[currentIndex].title}
              </h3>
              <p className="text-sm text-white/70">
                {currentIndex + 1} of {filteredItems.length}
              </p>
            </div>
          </div>
          
          {/* Thumbnails Navigation inside lightbox */}
          <div className="mt-8 flex gap-2 overflow-x-auto max-w-5xl w-full pb-2 scrollbar-thin">
             {filteredItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-20 h-14 flex-shrink-0 rounded-sm overflow-hidden transition-all ${
                    idx === currentIndex ? "border-2 border-[var(--gold)] opacity-100" : "opacity-40 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.type === "video" ? (item.thumb || item.src) : item.src}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play size={12} className="text-white fill-white" />
                    </div>
                  )}
                </button>
             ))}
          </div>
        </div>
      )}
    </section>
  );
}
