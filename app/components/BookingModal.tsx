"use client";

import { useState, useRef, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  BedDouble,
  Send,
  Download,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";

// ─── Room options ─────────────────────────────────────────────────────────────
const ROOMS = [
  { value: "cedar",    label: "Cedar Room",    price: 30000 },
  { value: "rosewood", label: "Rosewood Room", price: 30000 },
  { value: "marple",   label: "Marple Room",   price: 40000 },
  { value: "cherry",   label: "Cherry Room",   price: 50000 },
  { value: "basswood", label: "Basswood Room", price: 50000 },
  { value: "pine",     label: "Pine Room",     price: 50000 },
  { value: "oak",      label: "Oak Room",      price: 50000 },
  { value: "walnut",   label: "Walnut Room",   price: 50000 },
  { value: "redwood",  label: "Redwood Room",  price: 50000 },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function fmtPrice(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function fmtDate(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtDateFull(d: Date | null) {
  if (!d) return "N/A";
  return d.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function diffNights(a: Date | null, b: Date | null) {
  if (!a || !b) return 0;
  return Math.max(0, Math.floor((b.getTime() - a.getTime()) / 86400000));
}

// ─── Dropdown Date Picker ─────────────────────────────────────────────────────
function DatePicker({
  label,
  selected,
  minDate,
  onSelect,
  placeholder = "Select date…",
}: {
  label: string;
  selected: Date | null;
  minDate?: Date | null;
  onSelect: (d: Date) => void;
  placeholder?: string;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const base = selected ?? minDate ?? today;
  const [viewYear,  setViewYear]  = useState(base.getFullYear());
  const [viewMonth, setViewMonth] = useState(base.getMonth());
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close when focus leaves the component entirely
  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build grid
  const firstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMon = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMon }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const minD = new Date(minDate ?? today);
  minD.setHours(0, 0, 0, 0);

  const handlePickDate = (d: Date) => {
    onSelect(d);
    setOpen(false);
  };

  return (
    <div className="space-y-1.5 relative" ref={wrapRef} onBlur={handleBlur}>
      <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">
        {label}
      </label>

      {/* Trigger "input" */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 bg-[var(--dark-card)] border rounded-xl px-4 py-3 text-sm text-left transition-all duration-200 focus:outline-none
          ${open
            ? "border-[var(--gold)] shadow-lg shadow-[var(--gold)]/10"
            : "border-[var(--dark-border)] hover:border-[var(--gold)]/40"
          }`}
      >
        <Calendar size={14} className={`shrink-0 transition-colors ${open || selected ? "text-[var(--gold)]" : "text-[var(--warm-gray)]"}`} />
        <span className={`flex-1 ${selected ? "text-[var(--off-white)] font-medium" : "text-[var(--warm-gray)]"}`}>
          {selected ? fmtDate(selected) : placeholder}
        </span>
        <ChevronRight
          size={13}
          className={`text-[var(--warm-gray)] transition-transform duration-200 ${open ? "rotate-90 text-[var(--gold)]" : ""}`}
        />
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-[var(--dark)] border border-[var(--gold)]/25 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--dark-border)]">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--dark-border)] transition-colors text-[var(--warm-gray)] hover:text-[var(--off-white)]"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-semibold text-[var(--off-white)]">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--dark-border)] transition-colors text-[var(--warm-gray)] hover:text-[var(--off-white)]"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pt-3">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-[var(--warm-gray)] pb-1 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} />;
              const d = new Date(viewYear, viewMonth, day);
              d.setHours(0, 0, 0, 0);
              const isPast     = d < minD;
              const isSelected = selected != null && d.toDateString() === selected.toDateString();
              const isToday    = d.toDateString() === today.toDateString();
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => !isPast && handlePickDate(d)}
                  disabled={isPast}
                  className={`flex items-center justify-center text-xs rounded-full transition-all duration-150 font-medium mx-auto
                    ${isPast
                      ? "text-[var(--warm-gray)]/25 cursor-not-allowed"
                      : isSelected
                      ? "bg-[var(--gold)] text-[var(--black)] font-bold shadow-lg shadow-[var(--gold)]/30"
                      : isToday
                      ? "border border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)]/10"
                      : "text-[var(--off-white)] hover:bg-[var(--dark-border)]"
                    }`}
                  style={{ width: 32, height: 32 }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Booking Card (for download) ──────────────────────────────────────────────
function BookingCard({ name, email, phone, roomLabel, roomPrice, checkIn, checkOut, nights, bookingRef }: {
  name: string; email: string; phone: string;
  roomLabel: string; roomPrice: number;
  checkIn: Date | null; checkOut: Date | null;
  nights: number; bookingRef: string;
}) {
  return (
    <div
      id="booking-card"
      className="w-full max-w-[480px] bg-[#0a0a0a] text-white font-sans p-0 rounded-2xl overflow-hidden mx-auto"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Gold top bar */}
      <div className="h-2 w-full" style={{ background: "linear-gradient(90deg, #a08030, #c8a84b, #e2c97e, #c8a84b, #a08030)" }} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-white/10 gap-3 sm:gap-0">
        <div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#8a8072]">Booking Confirmation</div>
          <div className="font-bold text-[#c8a84b] text-lg sm:text-xl mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            ODM Groove Hotel
          </div>
          <div className="text-[9px] sm:text-[10px] text-[#6b6257] mt-0.5">Ijoko Ogbayo, Ogun State, Nigeria</div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-[8.5px] sm:text-[9px] uppercase tracking-widest text-[#6b6257]">Ref No.</div>
          <div className="text-xs font-bold text-[#c8a84b] mt-0.5">{bookingRef}</div>
          <div className="text-[8.5px] sm:text-[9px] text-[#6b6257] mt-1">
            Issued: {new Date().toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-8 py-5 sm:py-6 space-y-5">
        {/* Guest info */}
        <div>
          <div className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8072] mb-2">Guest Details</div>
          <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-2">
            <div className="col-span-1"><div className="text-[8.5px] sm:text-[9px] text-[#6b6257]">Full Name</div><div className="text-[13px] sm:text-sm font-semibold text-white mt-0.5">{name || "-"}</div></div>
            <div className="col-span-1"><div className="text-[8.5px] sm:text-[9px] text-[#6b6257]">Phone</div><div className="text-[13px] sm:text-sm font-semibold text-white mt-0.5">{phone || "-"}</div></div>
            <div className="col-span-2 break-all sm:break-normal"><div className="text-[8.5px] sm:text-[9px] text-[#6b6257]">Email</div><div className="text-[13px] sm:text-sm font-semibold text-white mt-0.5">{email || "-"}</div></div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Booking details */}
        <div>
          <div className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8072] mb-2">Booking Details</div>
          <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-3">
            <div className="col-span-2">
              <div className="text-[8.5px] sm:text-[9px] text-[#6b6257]">Room</div>
              <div className="text-sm sm:text-base font-bold text-[#c8a84b] mt-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>{roomLabel}</div>
              <div className="text-[9px] sm:text-[10px] text-[#8a8072]">{fmtPrice(roomPrice)} / night</div>
            </div>
            <div>
              <div className="text-[8.5px] sm:text-[9px] text-[#6b6257]">Check-in</div>
              <div className="text-[13px] sm:text-sm font-semibold text-white mt-0.5">{fmtDateFull(checkIn)}</div>
            </div>
            <div>
              <div className="text-[8.5px] sm:text-[9px] text-[#6b6257]">Check-out</div>
              <div className="text-[13px] sm:text-sm font-semibold text-white mt-0.5">{fmtDateFull(checkOut)}</div>
            </div>
            <div>
              <div className="text-[8.5px] sm:text-[9px] text-[#6b6257]">Duration</div>
              <div className="text-[13px] sm:text-sm font-semibold text-white mt-0.5">{nights} night{nights !== 1 ? "s" : ""}</div>
            </div>
            <div>
              <div className="text-[8.5px] sm:text-[9px] text-[#6b6257]">Est. Total</div>
              <div className="text-[13px] sm:text-sm font-bold text-[#c8a84b] mt-0.5">{fmtPrice(roomPrice * nights)}</div>
            </div>
          </div>
        </div>

        {/* Payment status banner */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
          <Clock size={16} className="text-amber-400 mt-0.5 shrink-0 hidden sm:block" />
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={14} className="sm:hidden" />
              Payment Pending
            </div>
            <div className="text-[10px] text-amber-200/70 mt-1 sm:mt-0.5">
              Payment has not been processed yet. Our front desk will contact you shortly to arrange payment and confirm your reservation.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 sm:px-8 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between bg-[#111111] gap-2 sm:gap-0">
        <div className="text-[8.5px] sm:text-[9px] text-[#6b6257]">📞 +234 706 151 4120  |  ✉️ odmgroove@gmail.com</div>
        <div className="text-[8.5px] sm:text-[9px] text-[#c8a84b] font-semibold">odmgroove.vercel.app</div>
      </div>

      {/* Gold bottom bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #a08030, #c8a84b, #e2c97e, #c8a84b, #a08030)" }} />
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultRoom?: string;
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function BookingModal({ isOpen, onClose, defaultRoom = "cedar" }: BookingModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  // Form values
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [room,  setRoom]  = useState(defaultRoom);
  const [checkIn,  setCheckIn]  = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const nights   = diffNights(checkIn, checkOut);
  const roomObj  = ROOMS.find(r => r.value === room) ?? ROOMS[0];
  const totalEst = roomObj.price * nights;

  const resetForm = () => {
    setStep("form");
    setName(""); setEmail(""); setPhone("");
    setRoom(defaultRoom);
    setCheckIn(null); setCheckOut(null);
  };

  const handleCheckInSelect = useCallback((d: Date) => {
    setCheckIn(d);
    if (checkOut && d >= checkOut) setCheckOut(null);
  }, [checkOut]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || nights < 1) return;

    setIsSubmitting(true);
    const ref = "ODM-" + Date.now().toString(36).toUpperCase();
    setBookingRef(ref);

    const checkInStr  = fmtDateFull(checkIn);
    const checkOutStr = fmtDateFull(checkOut);

    // ── WhatsApp ─────────────────────────────────────────────────────────────
    const waMsg = [
      "🏨 *ODM GROOVE — NEW ROOM BOOKING*",
      "━━━━━━━━━━━━━━━━━━━━━━",
      `📋 *Ref:* ${ref}`,
      "",
      "👤 *Guest Details:*",
      `• Name: ${name}`,
      `• Email: ${email}`,
      `• Phone: ${phone}`,
      "",
      "🛏️ *Booking Details:*",
      `• Room: ${roomObj.label}`,
      `• Check-in: ${checkInStr}`,
      `• Check-out: ${checkOutStr}`,
      `• Duration: ${nights} night${nights !== 1 ? "s" : ""}`,
      `• Rate: ${fmtPrice(roomObj.price)}/night`,
      `• Est. Total: ${fmtPrice(totalEst)}`,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "💳 *Payment Status: PENDING*",
      "Kindly contact the guest to confirm & arrange payment.",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "_Sent via ODM Groove website_",
    ].join("\n");

    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
      window.open(`https://wa.me/2347061514120?text=${encodeURIComponent(waMsg)}`, "_blank");
    }, 1200);
  };

  const downloadCard = useCallback(async () => {
    const el = document.getElementById("booking-card");
    // ── Draw booking card onto a canvas and download as PNG ─────────────────
    const S   = 2.5;           // scale for high-DPI output
    const CW  = 480;           // logical card width
    const CH  = 600;           // logical card height
    const canvas = document.createElement("canvas");
    canvas.width  = Math.round(CW * S);
    canvas.height = Math.round(CH * S);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(S, S);

    // ── Palette ────────────────────────────────────────────────────────────
    const GOLD  = "#c8a84b", GOLD_L = "#e2c97e", GOLD_D = "#a08030";
    const BG    = "#0a0a0a", BORDER = "#222222";
    const WHITE = "#ffffff",  DIM   = "#8a8072", MUTED = "#6b6257";
    const AMBER = "#f59e0b",  AMBER_D = "#92400e";

    // helper: filled rounded rect
    const fillRR = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y,     x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x,     y + h, r);
      ctx.arcTo(x,     y + h, x,     y,     r);
      ctx.arcTo(x,     y,     x + w, y,     r);
      ctx.closePath();
      ctx.fill();
    };
    const strokeRR = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y,     x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x,     y + h, r);
      ctx.arcTo(x,     y + h, x,     y,     r);
      ctx.arcTo(x,     y,     x + w, y,     r);
      ctx.closePath();
      ctx.stroke();
    };
    const goldGrad = () => {
      const g = ctx.createLinearGradient(0, 0, CW, 0);
      g.addColorStop(0, GOLD_D); g.addColorStop(0.25, GOLD);
      g.addColorStop(0.5, GOLD_L); g.addColorStop(0.75, GOLD);
      g.addColorStop(1, GOLD_D);
      return g;
    };
    const line = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // ── Background ─────────────────────────────────────────────────────────
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CW, CH);

    // ── Gold top bar ───────────────────────────────────────────────────────
    ctx.fillStyle = goldGrad();
    ctx.fillRect(0, 0, CW, 4);

    // ── Header ─────────────────────────────────────────────────────────────
    const PAD = 32;
    ctx.fillStyle = MUTED;
    ctx.font = "bold 8.5px 'Inter', Arial, sans-serif";
    ctx.fillText("BOOKING CONFIRMATION", PAD, 24);

    ctx.fillStyle = GOLD;
    ctx.font = "bold 17px Georgia, 'Times New Roman', serif";
    ctx.fillText("ODM Groove Hotel", PAD, 43);

    ctx.fillStyle = MUTED;
    ctx.font = "8px 'Inter', Arial, sans-serif";
    ctx.fillText("Ijoko Ogbayo, Ogun State, Nigeria", PAD, 56);

    // Ref + date (right-aligned)
    const issuedStr = new Date().toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
    ctx.textAlign = "right";
    ctx.fillStyle = MUTED;
    ctx.font = "bold 7.5px 'Inter', Arial, sans-serif";
    ctx.fillText("REF NO.", CW - PAD, 24);
    ctx.fillStyle = GOLD;
    ctx.font = "bold 10px 'Inter', Arial, sans-serif";
    ctx.fillText(bookingRef, CW - PAD, 38);
    ctx.fillStyle = MUTED;
    ctx.font = "7.5px 'Inter', Arial, sans-serif";
    ctx.fillText("Issued: " + issuedStr, CW - PAD, 51);
    ctx.textAlign = "left";

    // header divider
    ctx.strokeStyle = BORDER; ctx.lineWidth = 0.8;
    line(PAD, 68, CW - PAD, 68);

    // ── Guest Details ──────────────────────────────────────────────────────
    let y = 84;
    ctx.fillStyle = DIM;
    ctx.font = "bold 7.5px 'Inter', Arial, sans-serif";
    ctx.fillText("GUEST DETAILS", PAD, y);
    y += 16;

    const field = (label: string, val: string, x: number, fy: number): number => {
      ctx.fillStyle = MUTED; ctx.font = "7.5px 'Inter', Arial, sans-serif";
      ctx.fillText(label, x, fy);
      ctx.fillStyle = WHITE; ctx.font = "bold 10.5px 'Inter', Arial, sans-serif";
      ctx.fillText(val || "-", x, fy + 13);
      return fy + 28;
    };

    const c1 = PAD, c2 = 188, c3 = 320;
    y = field("Full Name", name,  c1, y);
    y = field("Phone",     phone, c1, y);
        field("Email",     email, c1, y);
    const guestBottom = y + 28;

    // ── Divider ────────────────────────────────────────────────────────────
    ctx.strokeStyle = BORDER; ctx.lineWidth = 0.8;
    line(PAD, guestBottom, CW - PAD, guestBottom);

    // ── Booking Details ────────────────────────────────────────────────────
    y = guestBottom + 14;
    ctx.fillStyle = DIM;
    ctx.font = "bold 7.5px 'Inter', Arial, sans-serif";
    ctx.fillText("BOOKING DETAILS", PAD, y);
    y += 16;

    // Room
    ctx.fillStyle = MUTED; ctx.font = "7.5px 'Inter', Arial, sans-serif";
    ctx.fillText("Room", c1, y);
    ctx.fillStyle = GOLD; ctx.font = "bold 12.5px Georgia, serif";
    ctx.fillText(roomObj.label, c1, y + 13);
    ctx.fillStyle = MUTED; ctx.font = "7.5px 'Inter', Arial, sans-serif";
    ctx.fillText(fmtPrice(roomObj.price) + " / night", c1, y + 24);

    // Check-in / Check-out
    field("Check-in",  fmtDate(checkIn),  c2, y);
    field("Check-out", fmtDate(checkOut), c3, y);
    y += 38;

    // Duration / Total
    field("Duration",  `${nights} night${nights !== 1 ? "s" : ""}`, c2, y);
    // Est total in gold
    ctx.fillStyle = MUTED; ctx.font = "7.5px 'Inter', Arial, sans-serif";
    ctx.fillText("Est. Total", c3, y);
    ctx.fillStyle = GOLD; ctx.font = "bold 13px 'Inter', Arial, sans-serif";
    ctx.fillText(fmtPrice(roomObj.price * nights), c3, y + 13);
    y += 38;

    // ── Payment Pending Banner ─────────────────────────────────────────────
    y += 8;
    ctx.fillStyle = "#1c1000";
    fillRR(PAD, y, CW - PAD * 2, 68, 8);
    ctx.strokeStyle = AMBER_D + "88"; ctx.lineWidth = 1;
    strokeRR(PAD, y, CW - PAD * 2, 68, 8);

    ctx.fillStyle = AMBER;
    ctx.font = "bold 9px 'Inter', Arial, sans-serif";
    ctx.fillText("PAYMENT PENDING", PAD + 14, y + 22);
    ctx.fillStyle = AMBER + "cc";
    ctx.font = "8px 'Inter', Arial, sans-serif";
    ctx.fillText("Payment not yet processed. Our team will contact you to arrange", PAD + 14, y + 37);
    ctx.fillText("payment. This card is proof that your booking was received.", PAD + 14, y + 50);
    ctx.fillText("Booking Date: " + new Date().toLocaleDateString("en-NG"), PAD + 14, y + 63);
    y += 80;

    // ── Footer ─────────────────────────────────────────────────────────────
    ctx.strokeStyle = BORDER; ctx.lineWidth = 0.8;
    line(PAD, y, CW - PAD, y);
    y += 14;

    ctx.fillStyle = MUTED; ctx.font = "7.5px 'Inter', Arial, sans-serif";
    ctx.fillText("+234 706 151 4120  |  odmgroove@gmail.com", PAD, y);
    ctx.textAlign = "right";
    ctx.fillStyle = GOLD; ctx.font = "bold 7.5px 'Inter', Arial, sans-serif";
    ctx.fillText("odmgroove.vercel.app", CW - PAD, y);
    ctx.textAlign = "left";

    // ── Gold bottom bar ────────────────────────────────────────────────────
    ctx.fillStyle = goldGrad();
    ctx.fillRect(0, CH - 3, CW, 3);

    // ── Trigger download ───────────────────────────────────────────────────
    const link = document.createElement("a");
    link.download = `ODM-Booking-${bookingRef}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [name, email, phone, roomObj, checkIn, checkOut, nights, bookingRef]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => !isSubmitting && step === "form" && onClose()}
      />

      {/* ── SUCCESS ──────────────────────────────────────────────────────────── */}
      {step === "success" ? (
        <div className="relative w-full max-w-xl flex flex-col items-center gap-6 z-10 max-h-[92vh] overflow-y-auto py-4">
          {/* Banner */}
          <div className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[var(--off-white)] mb-2">Booking Submitted!</h3>
            <p className="text-sm text-[var(--warm-gray)]">
              Your request has been sent via WhatsApp and email. Our team will contact you to confirm.
            </p>
            <div className="mt-3 inline-block bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg px-4 py-2">
              <span className="text-[10px] text-[var(--warm-gray)] uppercase tracking-widest">Ref: </span>
              <span className="text-sm font-bold text-[var(--gold)]">{bookingRef}</span>
            </div>
          </div>

          {/* Booking card */}
          <div className="w-full flex justify-center py-2" ref={cardRef}>
            <div className="w-full px-4 sm:px-0">
              <BookingCard
                name={name} email={email} phone={phone}
                roomLabel={roomObj.label} roomPrice={roomObj.price}
                checkIn={checkIn} checkOut={checkOut}
                nights={nights} bookingRef={bookingRef}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={downloadCard}
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--black)] font-bold text-sm py-3.5 rounded-xl hover:bg-[var(--gold-light)] transition-all shadow-lg shadow-[var(--gold)]/20"
            >
              <Download size={16} />
              Download Card
            </button>
            <button
              onClick={() => { resetForm(); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--dark-card)] border border-[var(--dark-border)] text-[var(--off-white)] font-semibold text-sm py-3.5 rounded-xl hover:bg-[var(--dark-border)] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        /* ── FORM ──────────────────────────────────────────────────────────── */
        <div className="relative w-full max-w-lg bg-[var(--black)] border border-[var(--dark-border)] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col">
          {/* Gold top bar */}
          <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg, #a08030, #c8a84b, #e2c97e, #c8a84b, #a08030)" }} />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dark-border)] shrink-0">
            <div>
              <h3 className="font-display font-bold text-xl text-[var(--gold)]">Book Your Stay</h3>
              <p className="text-xs text-[var(--warm-gray)] mt-0.5">ODM Groove Hotel &amp; Event Hall</p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-full bg-[var(--dark-card)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--off-white)] hover:bg-[var(--dark-border)] transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                  <input
                    required type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--off-white)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                  <input
                    required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--off-white)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Phone Number *</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                <input
                  required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+234 706 000 0000"
                  className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--off-white)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
              </div>
            </div>

            {/* Room */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">Room Type *</label>
              <div className="relative">
                <BedDouble size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
                <select
                  required value={room} onChange={e => setRoom(e.target.value)}
                  className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)] transition-colors appearance-none"
                >
                  {ROOMS.map(r => (
                    <option key={r.value} value={r.value}>{r.label} — {fmtPrice(r.price)}/night</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date pickers (closed by default, dropdown on click) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePicker
                label="Check-in Date *"
                selected={checkIn}
                onSelect={handleCheckInSelect}
                placeholder="Pick check-in date"
              />
              <DatePicker
                label="Check-out Date *"
                selected={checkOut}
                minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : null}
                onSelect={setCheckOut}
                placeholder="Pick check-out date"
              />
            </div>

            {/* Summary strip */}
            {nights > 0 && (
              <div className="rounded-xl bg-[var(--gold)]/5 border border-[var(--gold)]/20 px-5 py-3.5 flex items-center justify-between">
                <div className="text-sm text-[var(--warm-gray)]">
                  <span className="font-semibold text-[var(--off-white)]">{nights}</span> night{nights !== 1 ? "s" : ""} &nbsp;×&nbsp; {fmtPrice(roomObj.price)}/night
                </div>
                <div className="font-display font-bold text-lg text-[var(--gold)]">{fmtPrice(totalEst)}</div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !checkIn || !checkOut || nights < 1}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all
                disabled:bg-[var(--dark-border)] disabled:text-[var(--warm-gray)] disabled:cursor-not-allowed
                enabled:bg-[var(--gold)] enabled:text-[var(--black)] enabled:hover:bg-[var(--gold-light)] enabled:hover:shadow-xl enabled:hover:shadow-[var(--gold)]/20"
            >
              {isSubmitting ? (
                <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><Send size={15} /> Confirm Reservation</>
              )}
            </button>

            <p className="text-center text-[10px] text-[var(--warm-gray)] pb-2">
              Booking sent via WhatsApp &amp; email. Payment arranged upon confirmation.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
