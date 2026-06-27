"use client";

import { useState } from "react";
import { X, User, Mail, Phone, Calendar, Send, CheckCircle, Users, LayoutList } from "lucide-react";
import CustomSelect from "./CustomSelect";

type HallEnquiryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EVENT_TYPES = [
  "Wedding Reception",
  "Birthday Party",
  "Corporate Event",
  "Concert / Show",
  "Conference",
  "Other"
];

export default function HallEnquiryModal({ isOpen, onClose }: HallEnquiryModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [guests, setGuests] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !eventDate) return;

    setIsSubmitting(true);
    const ref = "ENQ-" + Date.now().toString(36).toUpperCase();

    // ── WhatsApp Payload ──────────────────────────────────────────────────────
    const waMsg = [
      "🎉 *ODM GROOVE — EVENT HALL ENQUIRY*",
      "━━━━━━━━━━━━━━━━━━━━━━",
      `📋 *Ref:* ${ref}`,
      "",
      "👤 *Client Details:*",
      `• Name: ${name}`,
      `• Email: ${email || "Not provided"}`,
      `• Phone: ${phone}`,
      "",
      "🎈 *Event Details:*",
      `• Type: ${eventType}`,
      `• Date: ${eventDate}`,
      `• Guests: ${guests || "Not specified"}`,
      "",
      "📝 *Additional Notes:*",
      notes ? `"${notes}"` : "None",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "💡 *Action Required:* Please contact the client with pricing and availability.",
      "_Sent via ODM Groove website_"
    ].join("\n");

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ref,
          name,
          email: email || null,
          phone,
          eventDate: new Date(eventDate),
          type: "hall",
          guests: guests ? parseInt(guests) : null,
          status: "pending",
          notes: `Event Type: ${eventType} | ${notes}`,
        }),
      });
    } catch (error) {
      console.error("Failed to save enquiry to database", error);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
      window.open(`https://wa.me/2347061514120?text=${encodeURIComponent(waMsg)}`, "_blank");
    }, 1200);
  };

  const resetForm = () => {
    setStep("form");
    setName(""); setEmail(""); setPhone("");
    setEventType(EVENT_TYPES[0]); setGuests(""); setEventDate(""); setNotes("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isSubmitting && step === "form" && onClose()}
      />

      {step === "success" ? (
        <div className="relative w-full max-w-md bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl p-6 text-center z-10">
          <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h3 className="font-display text-2xl font-bold text-[var(--off-white)] mb-2">Enquiry Sent!</h3>
          <p className="text-sm text-[var(--warm-gray)] mb-6">
            Your event hall enquiry has been sent to our team via WhatsApp. We will review your requirements and contact you shortly with a quote.
          </p>
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] text-[var(--off-white)] font-semibold text-sm py-3.5 rounded-xl hover:bg-[var(--dark-border)] transition-all"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-lg bg-[#0a0a0a]/95 backdrop-blur-xl border border-[var(--dark-border)] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col">
          {/* Gold top bar */}
          <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg, #a08030, #c8a84b, #e2c97e, #c8a84b, #a08030)" }} />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dark-border)] shrink-0">
            <div>
              <h3 className="font-display font-bold text-xl text-[var(--gold)]">Event Hall Enquiry</h3>
              <p className="text-xs text-[var(--warm-gray)] mt-0.5">Price Negotiable upon Enquiry</p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-full bg-[var(--dark-card)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--off-white)] hover:bg-[var(--dark-border)] transition-all"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                  <input
                    required type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Phone Number *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                  <input
                    required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+234 706 000 0000"
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email + Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Email (Optional)</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Est. Guests</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                  <input
                    type="number" min="1" value={guests} onChange={e => setGuests(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Event Type + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Event Type *</label>
                  <CustomSelect
                    value={eventType}
                    onChange={setEventType}
                    options={EVENT_TYPES.map(t => ({ value: t, label: t }))}
                    icon={<LayoutList size={14} />}
                  />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Proposed Date *</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                  <input
                    required type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Additional Requirements</label>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Tell us about your event, catering needs, decorations, etc."
                rows={3}
                className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !name || !phone || !eventDate}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all
                disabled:bg-[var(--dark-border)] disabled:text-[var(--warm-gray)] disabled:cursor-not-allowed
                enabled:bg-[var(--gold)] enabled:text-[var(--black)] enabled:hover:bg-[var(--gold-light)] enabled:hover:shadow-xl enabled:hover:shadow-[var(--gold)]/20"
            >
              {isSubmitting ? (
                <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Sending...</>
              ) : (
                <><Send size={15} /> Send Enquiry to WhatsApp</>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
