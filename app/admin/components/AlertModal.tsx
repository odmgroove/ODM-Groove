"use client";

import { X, AlertCircle } from "lucide-react";

type AlertModalProps = {
  title?: string;
  message: string;
  onClose: () => void;
};

export default function AlertModal({
  title = "Attention",
  message,
  onClose,
}: AlertModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-400" />
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--dark-card)] text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex flex-col items-center gap-4 text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--off-white)] mb-1">{title}</h2>
              <p className="text-sm text-[var(--warm-gray)]">{message}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[var(--dark-card)] border border-[var(--dark-border)] text-sm font-semibold text-[var(--off-white)] hover:bg-[var(--dark-border)] transition-all active:scale-[0.98]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
