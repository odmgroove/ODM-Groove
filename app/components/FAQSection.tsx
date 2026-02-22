"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Where is ODM Groove Hotel located?",
    a: "We are located at Shonekan Street, Ola-Oparun, After Aboki Ifa Villa in Ijoko Ogbayo, Ogun State. We are highly accessible and situated just a short drive from Lagos.",
  },
  {
    q: "What are your check-in and check-out times?",
    a: "Standard check-in time is from 2:00 PM, and check-out is at 12:00 PM (Noon). Early check-in or late check-out can be arranged subject to availability.",
  },
  {
    q: "What is included in the room price?",
    a: "Both our Standard (₦30,000) and Deluxe (₦50,000) rooms include free daily breakfast, high-speed WiFi, air conditioning, and a smart TV with Netflix & DSTV. Deluxe rooms also include free access to the swimming pool.",
  },
  {
    q: "What is the capacity of the Event Hall?",
    a: "Our versatile Event Hall can comfortably accommodate upwards of 200 guests, making it perfect for weddings, corporate seminars, birthday parties, and other grand celebrations.",
  },
  {
    q: "Do you offer parking and security?",
    a: "Yes, we provide ample free on-site parking for all our guests. The premises are heavily secured with 24/7 security personnel and surveillance systems.",
  },
  {
    q: "How can I book a room or the event hall?",
    a: "You can book directly by clicking any of the 'Book Now' buttons on this website, which will connect you to our reservations team via WhatsApp or Phone.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section className="relative section-padding bg-[var(--black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[var(--gold)]/60" />
            <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
              Information
            </span>
            <div className="h-px w-10 bg-[var(--gold)]/60" />
          </div>
          <h2
            className="font-display text-3xl md:text-5xl font-bold text-[var(--off-white)] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Frequently Asked <span className="gradient-text italic">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`glass-card rounded-sm overflow-hidden transition-colors ${
                  isOpen ? "border-[var(--gold)]/40" : "border-[var(--dark-border)]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`font-medium ${isOpen ? "text-[var(--gold)]" : "text-[var(--off-white)]"}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 text-[var(--warm-gray)] ${
                      isOpen ? "rotate-180 text-[var(--gold)]" : ""
                    }`}
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 pt-0 text-[var(--warm-gray)] text-sm leading-relaxed border-t border-[var(--dark-border)]/50 mt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
