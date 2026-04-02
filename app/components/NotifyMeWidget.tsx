"use client";

import { useState } from "react";
import { Bell, Check, ChevronRight, MessageCircle } from "lucide-react";

interface Props {
  whatsappNumber?: string; // default to ODM's number
  compact?: boolean;       // smaller inline version for sidebars
}

const WA_NUMBER = "2347061514120";

// Three message templates — user picks their vibe
const OPT_IN_MESSAGES = [
  {
    id: "notify",
    icon: "🔔",
    label: "Notify me for events",
    message:
      "Hi ODM Groove! Please add me to your events notification list so I never miss a party 🎉",
  },
  {
    id: "vip",
    icon: "👑",
    label: "I want VIP/early bird deals",
    message:
      "Hi! I'd like to be on your VIP list for early bird tickets and exclusive deals at ODM Groove 🔥",
  },
  {
    id: "hall",
    icon: "🎪",
    label: "I want to book the hall",
    message:
      "Hi ODM Groove! I'm interested in booking your event hall for a private function. Please send me more details 🙏",
  },
];

export default function NotifyMeWidget({ whatsappNumber = WA_NUMBER, compact = false }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSend = (msgId: string) => {
    const msg = OPT_IN_MESSAGES.find((m) => m.id === msgId);
    if (!msg) return;
    setSelected(msgId);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg.message)}`;
    window.open(waUrl, "_blank", "noopener noreferrer");
    setSent(true);
  };

  if (compact) {
    return (
      <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Bell size={14} className="text-[var(--gold)]" />
          <span className="text-[var(--gold)] text-xs uppercase tracking-[0.2em] font-semibold">
            Never Miss an Event
          </span>
        </div>
        <p className="text-[var(--warm-gray)] text-xs mb-3 leading-relaxed">
          Get notified on WhatsApp when the next event drops.
        </p>
        {sent ? (
          <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
            <Check size={13} /> Message sent — we&apos;ll add you to the list!
          </div>
        ) : (
          <button
            onClick={() => handleSend("notify")}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 transition-all"
          >
            <MessageCircle size={13} /> Notify Me on WhatsApp
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--dark-border)] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center flex-shrink-0">
          <Bell size={16} className="text-green-400" />
        </div>
        <div>
          <h3 className="text-[var(--off-white)] font-bold text-base">Stay in the Loop</h3>
          <p className="text-[var(--warm-gray)] text-xs">
            Get the next event dropped straight to your WhatsApp
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {sent ? (
          /* ── Success state ── */
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-green-400" />
            </div>
            <p className="text-[var(--off-white)] font-bold text-base mb-1">
              You&apos;re on the list! 🎉
            </p>
            <p className="text-[var(--warm-gray)] text-sm leading-relaxed">
              WhatsApp has opened with your message. Hit send if it hasn&apos;t gone automatically.
              <br />
              We&apos;ll notify you as soon as the next event drops.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-[var(--text-muted)] text-xs hover:text-[var(--warm-gray)] transition-colors underline"
            >
              Change preference
            </button>
          </div>
        ) : (
          /* ── Options ── */
          <>
            <p className="text-[var(--warm-gray)] text-sm">
              Pick what you want to be notified about and we&apos;ll add you to the right list:
            </p>
            <div className="space-y-3">
              {OPT_IN_MESSAGES.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSend(msg.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all duration-200 group hover:border-green-500/40 hover:bg-green-500/5"
                  style={{
                    background: selected === msg.id ? "rgba(34,197,94,0.08)" : "var(--dark)",
                    borderColor: selected === msg.id ? "rgba(34,197,94,0.4)" : "var(--dark-border)",
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{msg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--off-white)] font-semibold text-sm">{msg.label}</p>
                    <p className="text-[var(--warm-gray)] text-xs mt-0.5 truncate">{msg.message.slice(0, 60)}…</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-green-400 text-xs font-semibold hidden sm:block">WhatsApp</span>
                    <ChevronRight size={16} className="text-green-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Trust line */}
            <p className="text-[var(--text-muted)] text-xs text-center pt-1">
              📲 Opens WhatsApp with a message pre-written — just tap Send.
              <br />
              We only message you about events, never spam.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
