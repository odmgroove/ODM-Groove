"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Samuel O.",
    role: "Business Traveler",
    text: "The Wifi is incredibly fast and dependable, which is rare for many hotels in the area. Plus, the Standard Room was pristine and very comfortable. Will definitely be returning on my next trip to Ogun State.",
    rating: 5,
  },
  {
    id: 2,
    name: "Adesuwa M.",
    role: "Staycation Guest",
    text: "My weekend stay in the Deluxe Room was absolute perfection. The pool area is beautiful, the staff is very warm and welcoming, and sipping cocktails at the rooftop bar was the highlight of my trip.",
    rating: 5,
  },
  {
    id: 3,
    name: "Chukwudi E.",
    role: "Event Organizer",
    text: "We hosted a 150-guest wedding reception at the ODM Groove event hall. The venue was spacious, fully air-conditioned, and the security was top-notch. Highly recommend for any major event near Lagos.",
    rating: 4,
  },
  {
    id: 4,
    name: "Biola T.",
    role: "Local Resident",
    text: "Such a hidden gem in Ijoko! The nightclub has great energy on weekends, and the rooms give you a nice quiet retreat afterwards. You get much more luxury than what you pay for.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative section-padding bg-[var(--dark)] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-[var(--gold)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="h-px w-10 bg-[var(--gold)]/60" />
          <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
            Guest Experiences
          </span>
          <div className="h-px w-10 bg-[var(--gold)]/60" />
        </div>

        <div className="relative grid">
          {testimonials.map((review, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={review.id}
                className={`col-start-1 row-start-1 transition-all duration-700 mx-auto max-w-3xl flex flex-col items-center
                  ${isActive ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-8 pointer-events-none -z-10"}
                `}
                aria-hidden={!isActive}
              >
                <Quote size={40} className="text-[var(--gold)]/30 mb-6" />
                
                <p className="font-display text-lg md:text-xl lg:text-2xl text-[var(--off-white)] leading-relaxed md:leading-relaxed mb-8 font-medium" style={{ fontFamily: "Playfair Display, serif" }}>
                  &quot;{review.text}&quot;
                </p>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "text-[var(--gold)] fill-[var(--gold)]" : "text-[var(--warm-gray)]"}
                    />
                  ))}
                </div>
                
                <div>
                  <h4 className="text-[var(--off-white)] font-bold text-sm tracking-wide uppercase mb-1">
                    {review.name}
                  </h4>
                  <p className="text-[var(--warm-gray)] text-xs uppercase tracking-widest">
                    {review.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots navigation */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentIndex ? "w-8 bg-[var(--gold)]" : "w-2 bg-[var(--dark-border)] hover:bg-[var(--warm-gray)]"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
