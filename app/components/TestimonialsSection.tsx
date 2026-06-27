"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, Quote, Plus, X, UploadCloud, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { upload } from "@vercel/blob/client";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  visible: boolean;
  images: string | null; // JSON array of urls
};

// ─── Add Review Modal ───────────────────────────────────────────────────────
function AddReviewModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    
    if (files.length + newFiles.length > 3) {
      setError("You can only upload up to 3 images.");
      return;
    }
    
    setError("");
    const combinedFiles = [...files, ...newFiles].slice(0, 3);
    setFiles(combinedFiles);
    
    // Generate previews
    const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError("Name and Review are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Upload images to Vercel Blob if any
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        uploadedUrls.push(newBlob.url);
      }

      // 2. Submit to our API
      const payload = {
        name,
        role: role.trim() || null,
        content,
        rating,
        images: uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : null,
        // visible will default to false via prisma schema
      };

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit review");

      setSuccess(true);
      setTimeout(onClose, 3000); // Close after 3s
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--dark-border)] flex items-center justify-between shrink-0 bg-[var(--dark)] z-10">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--off-white)]">Add Your Review</h2>
            <p className="text-xs text-[var(--warm-gray)]">Share your experience at ODM Groove Hotel</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--dark-card)] text-[var(--warm-gray)] hover:text-[var(--off-white)] hover:bg-[var(--dark-border)] transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mb-4">
                <Check size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-[var(--off-white)] mb-2">Review Submitted!</h3>
              <p className="text-[var(--warm-gray)] text-sm max-w-[250px]">
                Thank you for your feedback! Your review is pending admin approval and will appear on the site shortly.
              </p>
            </div>
          ) : (
            <form id="review-form" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={28} 
                        className={star <= rating ? "text-[var(--gold)] fill-[var(--gold)]" : "text-[var(--dark-border)]"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">
                    Role (Optional)
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. VIP Guest, Event Host"
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              {/* Review Content */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell us about your experience..."
                  className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                />
              </div>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">
                    Photos (Max 3)
                  </label>
                  <span className="text-[10px] text-[var(--warm-gray)]">{files.length}/3 uploaded</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((preview, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--dark-border)] bg-[var(--black)] group">
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {files.length < 3 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border border-dashed border-[var(--dark-border)] flex flex-col items-center justify-center gap-2 hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/5 transition-all text-[var(--warm-gray)] hover:text-[var(--gold)]"
                    >
                      <UploadCloud size={24} />
                      <span className="text-[10px] font-medium uppercase tracking-wider">Add Photo</span>
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                />
              </div>
              
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </form>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="p-6 border-t border-[var(--dark-border)] bg-[var(--dark)] shrink-0">
            <button
              type="submit"
              form="review-form"
              disabled={isSubmitting}
              className={`w-full py-4 flex items-center justify-center gap-2 text-sm tracking-wider uppercase font-bold transition-all rounded-sm
                ${isSubmitting ? "bg-[var(--dark-border)] text-[var(--warm-gray)] cursor-not-allowed" : "btn-gold"}
              `}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-[var(--warm-gray)] border-t-transparent rounded-full" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          // Filter out unapproved testimonials just in case, though API should only return visible
          setTestimonials(data.filter((t: Testimonial) => t.visible));
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="relative section-padding bg-[var(--dark)] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-[var(--gold)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-[var(--gold)]/60" />
            <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
              Guest Experiences
            </span>
            <div className="h-px w-10 bg-[var(--gold)]/60" />
          </div>

          {/* Add Review Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--dark-card)] border border-[var(--gold)]/30 text-[var(--off-white)] text-sm font-semibold hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all shadow-lg"
          >
            <Plus size={16} className="text-[var(--gold)] group-hover:rotate-90 transition-transform" />
            Add Your Review
          </button>
        </div>

        {testimonials.length === 0 ? (
          <div className="py-20">
            <p className="text-[var(--warm-gray)]">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="relative grid min-h-[300px]">
            {testimonials.map((review, idx) => {
              const isActive = idx === currentIndex;
              
              // Parse images if any
              let images: string[] = [];
              if (review.images) {
                try { images = JSON.parse(review.images); } catch(e) {}
              }

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
                    &quot;{review.content}&quot;
                  </p>

                  {/* Display Review Images */}
                  {images.length > 0 && (
                    <div className="flex gap-3 mb-8 justify-center">
                      {images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-[var(--dark-border)] group">
                           <Image src={img} alt={`Review by ${review.name}`} fill className="object-cover group-hover:scale-110 transition-transform" />
                        </div>
                      ))}
                    </div>
                  )}
                  
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
                    {review.role && (
                      <p className="text-[var(--warm-gray)] text-xs uppercase tracking-widest">
                        {review.role}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dots navigation */}
        {testimonials.length > 1 && (
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
        )}
      </div>

      {isModalOpen && <AddReviewModal onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}
