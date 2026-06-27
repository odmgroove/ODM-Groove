"use client";

import { X, AlertTriangle } from "lucide-react";

type ConfirmModalProps = {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Yes, Delete",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-400" />
        <div className="p-6">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--dark-card)] text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>

          <div className="flex flex-col items-center gap-4 text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--off-white)] mb-1">{title}</h2>
              <div className="text-sm text-[var(--warm-gray)]">{message}</div>
            </div>
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
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
