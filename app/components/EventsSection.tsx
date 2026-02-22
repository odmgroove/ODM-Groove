"use client";

import Image from "next/image";
import { Users, Music, Wine, Car, ArrowRight } from "lucide-react";

export default function EventsSection() {
  return (
    <section
      id="events"
      className="relative section-padding bg-[var(--black)] overflow-hidden"
      aria-labelledby="events-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
                The Venue
              </span>
              <div className="h-px w-10 bg-[var(--gold)]/60" />
            </div>
            
            <h2
              id="events-heading"
              className="font-display text-3xl md:text-5xl font-bold text-[var(--off-white)] mb-6 leading-tight"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Host Unforgettable <br/>
              <span className="gradient-text italic">Events & Celebrations</span>
            </h2>
            
            <p className="text-[var(--warm-gray)] text-base leading-relaxed mb-8">
              Whether you are planning a dream wedding, a corporate seminar, or a grand birthday party, 
              ODM Groove&apos;s expansive event hall is the perfect canvas for your celebration. With a capacity 
              of over 200 guests and premium facilities, we guarantee a seamless experience.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                { icon: Users, label: "200+ Capacity", desc: "Spacious seating" },
                { icon: Car, label: "Secure Parking", desc: "On-site security" },
                { icon: Music, label: "Sound System", desc: "Premium acoustics" },
                { icon: Wine, label: "Catering", desc: "Available on request" },
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
                href="https://wa.me/234?text=I%20would%20like%20to%20inquire%20about%20booking%20the%20Event%20Hall"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center justify-center gap-2 group"
              >
                Inquire Now
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Media Collage */}
          <div className="order-1 lg:order-2 relative h-[500px] lg:h-[600px] w-full">
            <div className="absolute top-0 right-0 w-[80%] h-[80%] rounded-sm overflow-hidden shadow-2xl z-20 border border-[var(--dark-border)]">
              <Image
                src="/hall/odm-groove-event-hall-interior-view-1.jpg"
                alt="VIP Event Lounge"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-[60%] h-[50%] rounded-sm overflow-hidden shadow-2xl z-30 border-4 border-[var(--background)]">
              <Image
                src="/hall/odm-groove-event-hall-front-view.jpg"
                alt="Outdoor Gathering Space"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[var(--gold)]/20 rounded-full blur-2xl z-10" />
            <div className="absolute -z-10 -right-10 -bottom-10 w-full h-full border border-[var(--dark-border)] rounded-sm" />
          </div>

        </div>
      </div>
    </section>
  );
}
