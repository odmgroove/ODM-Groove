"use client";

import { useState, useEffect } from "react";
import { Check, X, Trash2, Eye, EyeOff, Star, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  visible: boolean;
  images: string | null;
  createdAt: string;
};

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<Testimonial | null>(null);
  const [confirmRemoveImage, setConfirmRemoveImage] = useState<{ testimonial: Testimonial; idx: number } | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        setSuccessMessage("Testimonial updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error updating: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An unexpected error occurred.");
    }
  };

  const handleDelete = async (id: string) => {
    const t = testimonials.find(t => t.id === id);
    if (t) setConfirmDelete(t);
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials(prev => prev.filter(t => t.id !== confirmDelete.id));
        setSuccessMessage("Testimonial deleted.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error deleting: ${await res.text()}`);
      }
    } catch (e) { 
      setAlertMessage("An error occurred while deleting."); 
    }
    setConfirmDelete(null);
  };

  const removeImage = async (testimonial: Testimonial, imgIndex: number) => {
    setConfirmRemoveImage({ testimonial, idx: imgIndex });
  };

  const confirmAndRemoveImage = async () => {
    if (!confirmRemoveImage) return;
    const { testimonial, idx } = confirmRemoveImage;
    if (!testimonial.images) { setConfirmRemoveImage(null); return; }
    try {
      const images: string[] = JSON.parse(testimonial.images);
      images.splice(idx, 1);
      const newImagesString = images.length > 0 ? JSON.stringify(images) : null;
      await handleUpdate(testimonial.id, { images: newImagesString });
    } catch {}
    setConfirmRemoveImage(null);
  };

  if (loading) {
    return <div className="p-6 text-[var(--warm-gray)]">Loading...</div>;
  }

  const pending = testimonials.filter(t => !t.visible);
  const approved = testimonials.filter(t => t.visible);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <div>
        <div className="sticky top-0 z-10 bg-[var(--black)]/95 backdrop-blur-md pb-4 pt-6 -mt-6 -mx-6 px-6 border-b border-[var(--dark-border)] mb-6">
          <h2 className="font-display text-2xl font-bold text-[var(--off-white)] mb-2 flex items-center gap-3">
            Pending Reviews 
            {pending.length > 0 && (
              <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full font-sans">
                {pending.length} New
              </span>
            )}
          </h2>
          <p className="text-[var(--warm-gray)] text-sm">Review submitted testimonials before they appear on the website.</p>
        </div>
        {pending.length === 0 ? (
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-8 text-center text-[var(--warm-gray)]">
            <Check size={32} className="mx-auto mb-3 opacity-50" />
            <p>You&apos;re all caught up! No pending reviews.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pending.map(t => (
              <TestimonialCard key={t.id} testimonial={t} onUpdate={handleUpdate} onDelete={handleDelete} onRemoveImage={removeImage} isPending />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-[var(--off-white)] mb-6">Approved Reviews</h2>
        <div className="grid gap-6">
          {approved.map(t => (
            <TestimonialCard key={t.id} testimonial={t} onUpdate={handleUpdate} onDelete={handleDelete} onRemoveImage={removeImage} />
          ))}
        </div>
      </div>
      {confirmDelete && (
        <ConfirmModal
          title="Delete Testimonial?"
          message={<>Remove review from <strong className="text-[var(--off-white)]">{confirmDelete.name}</strong> permanently?</>}
          onConfirm={confirmAndDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}

      {/* ── Success Toast ── */}
      {successMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {confirmRemoveImage && (
        <ConfirmModal
          title="Remove Image?"
          message="This photo will be permanently removed from the testimonial."
          confirmLabel="Yes, Remove"
          onConfirm={confirmAndRemoveImage}
          onCancel={() => setConfirmRemoveImage(null)}
        />
      )}
    </div>
  );
}

function TestimonialCard({ 
  testimonial, 
  onUpdate, 
  onDelete, 
  onRemoveImage,
  isPending = false 
}: { 
  testimonial: Testimonial, 
  onUpdate: (id: string, updates: Partial<Testimonial>) => void,
  onDelete: (id: string) => void,
  onRemoveImage: (t: Testimonial, idx: number) => void,
  isPending?: boolean
}) {
  let images: string[] = [];
  if (testimonial.images) {
    try { images = JSON.parse(testimonial.images); } catch {}
  }

  return (
    <div className={`bg-[var(--dark-card)] border rounded-xl overflow-hidden transition-all ${isPending ? "border-orange-500/30" : "border-[var(--dark-border)]"}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-[var(--off-white)]">{testimonial.name}</h3>
            <p className="text-xs text-[var(--warm-gray)]">{testimonial.role || "Guest"} • {new Date(testimonial.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < testimonial.rating ? "text-[var(--gold)] fill-[var(--gold)]" : "text-[var(--dark-border)]"} />
            ))}
          </div>
        </div>
        
        <p className="text-sm text-[var(--warm-gray)] italic mb-6">&quot;{testimonial.content}&quot;</p>

        {images.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <ImageIcon size={12} /> Attached Images
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--dark-border)] shrink-0 group">
                  <Image src={img} alt="attachment" fill className="object-cover" />
                  <button
                    onClick={() => {
                      onRemoveImage(testimonial, idx);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    title="Delete image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-[var(--dark-border)]">
          {isPending ? (
            <button 
              onClick={() => onUpdate(testimonial.id, { visible: true })}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-emerald-500/30 transition-all"
            >
              <Check size={16} /> Approve &amp; Publish
            </button>
          ) : (
            <button 
              onClick={() => onUpdate(testimonial.id, { visible: !testimonial.visible })}
              className={`flex items-center gap-2 py-2 px-4 border rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                testimonial.visible
                  ? "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              {testimonial.visible ? <><EyeOff size={16} /> Hide from Site</> : <><Eye size={16} /> Show on Site</>}
            </button>
          )}
          
          <button 
            onClick={() => onDelete(testimonial.id)}
            className="flex items-center gap-2 py-2 px-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/20 transition-all ml-auto"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
