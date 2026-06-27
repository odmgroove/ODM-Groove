"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, UploadCloud, X, Tag, AlertTriangle } from "lucide-react";
import CustomSelect from "../../../components/CustomSelect";
import AlertModal from "../AlertModal";

type GalleryImage = {
  id: string;
  url: string;
  caption?: string | null;
  category?: string | null;
  order: number;
};

const CATEGORIES = ["", "venue", "rooms", "pool", "event", "food", "nightlife"];
const CATEGORY_LABELS: Record<string, string> = {
  "": "All",
  venue: "Venue",
  rooms: "Rooms",
  pool: "Pool",
  event: "Events",
  food: "Food & Bar",
  nightlife: "Nightlife",
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({
  onConfirm,
  onCancel,
  imageSrc,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  imageSrc: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-400" />
        <div className="p-6">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--dark-card)] text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex flex-col items-center gap-4 text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--off-white)] mb-1">Delete Image?</h2>
              <p className="text-sm text-[var(--warm-gray)]">
                This will permanently remove the image from your gallery. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Thumbnail preview */}
          <div className="relative w-full h-32 rounded-xl overflow-hidden mb-6 border border-[var(--dark-border)]">
            <Image src={imageSrc} alt="Image to delete" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-[var(--dark-border)] text-sm font-semibold text-[var(--warm-gray)] hover:text-[var(--off-white)] hover:bg-[var(--dark-card)] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-all active:scale-[0.98]"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingCaption, setPendingCaption] = useState("");
  const [pendingCategory, setPendingCategory] = useState("venue");
  const [confirmDelete, setConfirmDelete] = useState<GalleryImage | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) setImages(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filesToUpload = Array.from(e.target.files);
    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];

        // Server-side upload via our API route (avoids CORS on localhost)
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");
        const blob = await uploadRes.json();

        // Save URL to DB
        await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: blob.url,
            caption: pendingCaption || null,
            category: pendingCategory || null,
            order: images.length + i,
          }),
        });

        setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
      }
      await fetchImages();
      setPendingCaption("");
      setSuccessMessage("Images uploaded successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Gallery upload error:", err);
      setAlertMessage("Upload failed. Please check your Vercel Blob configuration.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/gallery/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setImages(prev => prev.filter(i => i.id !== confirmDelete.id));
        setSuccessMessage("Image deleted.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error deleting image: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while deleting.");
    }
    setConfirmDelete(null);
  };

  const filtered = filterCategory
    ? images.filter(i => i.category === filterCategory)
    : images;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--off-white)]">Gallery</h2>
          <p className="text-sm text-[var(--warm-gray)]">{images.length} images</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-gold flex items-center gap-2 !px-4 !py-2.5 !text-xs"
        >
          <UploadCloud size={14} /> {uploading ? `Uploading ${uploadProgress}%...` : "Upload Images"}
        </button>
      </div>

      {/* Upload options */}
      <div className="bg-[var(--dark-card)] border border-[var(--gold)]/20 rounded-xl p-4 mb-6">
        <p className="text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-3">Upload Settings (apply to next upload)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[var(--warm-gray)] mb-1">Caption (optional)</label>
            <input
              value={pendingCaption}
              onChange={e => setPendingCaption(e.target.value)}
              placeholder="e.g. Pool area view"
              className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--warm-gray)] mb-1">Category</label>
            <CustomSelect
              value={pendingCategory}
              onChange={setPendingCategory}
              options={CATEGORIES.filter(c => c !== "").map(c => ({ value: c, label: CATEGORY_LABELS[c] }))}
            />
          </div>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-2">You can select multiple images at once. JPG, PNG, WebP supported.</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filterCategory === cat
                ? "bg-[var(--gold)] text-[var(--black)]"
                : "bg-[var(--dark-card)] border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--off-white)]"
            }`}
          >
            {CATEGORY_LABELS[cat] || "All"} ({cat ? images.filter(i => i.category === cat).length : images.length})
          </button>
        ))}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
      />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-[var(--dark-card)] animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--warm-gray)] border-2 border-dashed border-[var(--dark-border)] rounded-xl">
          <UploadCloud size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">No images yet</p>
          <p className="text-sm mb-4">Click &quot;Upload Images&quot; to add photos to your gallery</p>
          <button onClick={() => fileInputRef.current?.click()} className="btn-gold !px-5 !py-2.5 !text-xs">
            Upload Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.sort((a, b) => a.order - b.order).map((img) => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group border border-[var(--dark-border)] bg-[var(--dark-card)]">
              <Image
                src={img.url}
                alt={img.caption || "Gallery image"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button
                    onClick={() => setConfirmDelete(img)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  {img.caption && (
                    <p className="text-white text-xs font-medium line-clamp-2">{img.caption}</p>
                  )}
                  {img.category && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[var(--gold)]/30 text-[var(--gold)] border border-[var(--gold)]/30">
                      <Tag size={8} /> {CATEGORY_LABELS[img.category]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <ConfirmDeleteModal
          imageSrc={confirmDelete.url}
          onConfirm={confirmAndDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Alert Modal */}
      {alertMessage && (
        <AlertModal
          title="Error"
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
    </div>
  );
}
