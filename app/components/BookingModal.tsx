"use client";

import { useState, FormEvent } from "react";
import { X, Calendar, User, Mail, Phone, BedDouble, CheckCircle } from "lucide-react";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultRoom?: string;
};

export default function BookingModal({ isOpen, onClose, defaultRoom = "cedar" }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset after showing success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 text-[var(--off-white)]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => !isSubmitting && !isSuccess && onClose()}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-lg glass-card border-[var(--dark-border)] rounded-sm shadow-2xl overflow-hidden animate-fadeIn"
        style={{ backgroundColor: "rgba(10, 10, 10, 0.95)" }}
      >
        {/* Header */}
        <div className="bg-[var(--dark)] px-6 py-4 border-b border-[var(--dark-border)] flex items-center justify-between">
          <h3 className="font-display font-bold text-xl text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>
            Book Your Stay
          </h3>
          <button 
            onClick={onClose}
            disabled={isSubmitting || isSuccess}
            className="text-[var(--warm-gray)] hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess ? (
             <div className="flex flex-col items-center justify-center py-10 text-center animate-fadeIn">
                <CheckCircle size={64} className="text-emerald-500 mb-6" />
                <h4 className="text-2xl font-bold mb-2">Booking Requested!</h4>
                <p className="text-[var(--warm-gray)]">
                  Thank you for choosing ODM Groove. Our front desk will contact you shortly to confirm your reservation and arrange payment.
                </p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--warm-gray)]">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                    <input required type="text" className="w-full bg-[#1a1a1a] border border-[var(--dark-border)] rounded-sm pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--gold)] outline-none" placeholder="John Doe" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--warm-gray)]">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                    <input required type="email" className="w-full bg-[#1a1a1a] border border-[var(--dark-border)] rounded-sm pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--gold)] outline-none" placeholder="john@example.com" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--warm-gray)]">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                    <input required type="tel" className="w-full bg-[#1a1a1a] border border-[var(--dark-border)] rounded-sm pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--gold)] outline-none" placeholder="+234 XXX XXXX" />
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--warm-gray)]">Room Type</label>
                  <div className="relative">
                    <BedDouble size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                    <select required defaultValue={defaultRoom} className="w-full bg-[#1a1a1a] border border-[var(--dark-border)] rounded-sm pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--gold)] outline-none appearance-none">
                       <option value="cedar">Cedar Room (₦30,000/night)</option>
                       <option value="rosewood">Rosewood Room (₦30,000/night)</option>
                       <option value="marple">Marple Room (₦40,000/night)</option>
                       <option value="cherry">Cherry Room (₦50,000/night)</option>
                       <option value="basswood">Basswood Room (₦50,000/night)</option>
                       <option value="pine">Pine Room (₦50,000/night)</option>
                       <option value="oak">Oak Room (₦50,000/night)</option>
                       <option value="walnut">Walnut Room (₦50,000/night)</option>
                       <option value="redwood">Redwood Room (₦50,000/night)</option>
                    </select>
                  </div>
                </div>

                {/* Check In */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--warm-gray)]">Check-in</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] z-10" />
                    <input required type="date" className="w-full bg-[#1a1a1a] border border-[var(--dark-border)] rounded-sm pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--gold)] outline-none relative" />
                  </div>
                </div>

                {/* Check Out */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--warm-gray)]">Check-out</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] z-10" />
                    <input required type="date" className="w-full bg-[#1a1a1a] border border-[var(--dark-border)] rounded-sm pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[var(--gold)] outline-none relative" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-gold w-full mt-6 py-3.5 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  "Confirm Reservation"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
