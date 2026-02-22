import Image from "next/image";
import { MessageCircle, PhoneCall } from "lucide-react";

export default function BookingCTASection() {
  return (
    <section className="relative py-24 bg-[var(--black)] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Outdoor night view/odm-groove-nightlife-outdoor-1.jpg"
          alt="ODM Groove Hotel at Night"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)] via-transparent to-[var(--black)]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
        <div className="inline-flex items-center gap-2 mb-8 glass-card border-[var(--gold)]/30 px-6 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[var(--gold)] text-xs tracking-widest uppercase font-medium">
            Rooms are available tonight
          </span>
        </div>
        
        <h2
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Ready for an Unforgettable <span className="italic text-[var(--gold)]">Experience?</span>
        </h2>
        
        <p className="text-[var(--off-white)]/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Whether you&apos;re looking to relax in our luxury suites or host a grand event, ODM Groove is waiting to welcome you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
         <a
            href="https://wa.me/2347061514120"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold w-full sm:w-auto h-14 flex items-center justify-center gap-2 group text-base"
          >
            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
            Book via WhatsApp
          </a>
          <a
            href="tel:+2347061514120"
            className="btn-ghost flex items-center justify-center gap-2"
          >
            <PhoneCall size={18} />
            Call Front Desk
          </a>
        </div>
      </div>
    </section>
  );
}
