"use client";

import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function fmtDate(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DatePicker({
  label,
  selected,
  minDate,
  maxDate,
  onSelect,
  placeholder = "Select date…",
  className = "",
  align = "left",
}: {
  label?: string;
  selected: Date | null;
  minDate?: Date | null;
  maxDate?: Date | null;
  onSelect: (d: Date) => void;
  placeholder?: string;
  className?: string;
  align?: "left" | "right";
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

  const minD = minDate ? new Date(minDate) : null;
  if (minD) minD.setHours(0, 0, 0, 0);

  const maxD = maxDate ? new Date(maxDate) : null;
  if (maxD) maxD.setHours(23, 59, 59, 999);

  const handlePickDate = (d: Date) => {
    onSelect(d);
    setOpen(false);
  };

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={wrapRef} onBlur={handleBlur} tabIndex={-1}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)]">
          {label}
        </label>
      )}

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
        <span className={`flex-1 truncate ${selected ? "text-[var(--off-white)] font-medium" : "text-[var(--warm-gray)]"}`}>
          {selected ? fmtDate(selected) : placeholder}
        </span>
        <ChevronRight
          size={13}
          className={`shrink-0 text-[var(--warm-gray)] transition-transform duration-200 ${open ? "rotate-90 text-[var(--gold)]" : ""}`}
        />
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full z-50 mt-1 w-64 bg-[var(--dark)] border border-[var(--gold)]/25 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden`}>
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
              const isPast     = minD ? d < minD : false;
              const isFuture   = maxD ? d > maxD : false;
              const isDisabled = isPast || isFuture;
              const isSelected = selected != null && d.toDateString() === selected.toDateString();
              const isToday    = d.toDateString() === today.toDateString();
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => !isDisabled && handlePickDate(d)}
                  disabled={isDisabled}
                  className={`flex items-center justify-center text-xs rounded-full transition-all duration-150 font-medium mx-auto
                    ${isDisabled
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
