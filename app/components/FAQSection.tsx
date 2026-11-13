"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export default function FAQSection({ initialFaqs }: { initialFaqs?: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs ?? []);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(!initialFaqs || initialFaqs.length === 0);

  useEffect(() => {
    if (initialFaqs && initialFaqs.length > 0) return;
    async function fetchFaqs() {
      try {
        const res = await fetch("/api/faqs");
        if (res.ok) {
          const data = await res.json();
          setFaqs(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, [initialFaqs]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ Schema only when FAQs exist
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  if (loading && faqs.length === 0) return null;
  if (faqs.length === 0) return null;

  return (
    <section
      className="relative section-padding bg-[var(--black)]"
      aria-labelledby="faq-heading"
    >
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
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
            id="faq-heading"
            className="font-display text-3xl md:text-5xl font-bold text-[var(--off-white)] mb-4"
          >
            Frequently Asked <span className="gradient-text italic">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
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
                    {faq.question}
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
                    {faq.answer}
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
