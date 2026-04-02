"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Download, ImageIcon, RefreshCw, Check } from "lucide-react";
import { formatEventDate, type Event } from "../lib/eventsData";

interface Props {
  event: Event;
}

// Card style options
const CARD_STYLES = [
  { id: "dark",    label: "Dark Vibes",   bg: "#0a0a0a", text: "#f5f0e8", sub: "#8a8072" },
  { id: "color",   label: "Full Color",   bg: "accent",  text: "#ffffff", sub: "#ffffff99" },
  { id: "minimal", label: "Minimal",      bg: "#111111", text: "#ffffff", sub: "#888888" },
] as const;

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function drawCard(
  canvas: HTMLCanvasElement,
  event: Event,
  styleId: string,
) {
  const SIZE = 1080;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  const style = CARD_STYLES.find((s) => s.id === styleId) ?? CARD_STYLES[0];
  const accent = event.accentColor;
  const accentRgb = hexToRgb(accent.startsWith("#") ? accent : "#00b4d8");

  // ── Background ──────────────────────────────────────────────────────────
  if (style.bg === "accent") {
    // Vivid gradient background
    const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    grad.addColorStop(0, accent);
    grad.addColorStop(0.5, `rgba(${accentRgb.r * 0.6},${accentRgb.g * 0.6},${accentRgb.b * 0.6},1)`);
    grad.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);
  } else {
    ctx.fillStyle = style.bg;
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Subtle radial glow from top
    const glow = ctx.createRadialGradient(SIZE / 2, 0, 0, SIZE / 2, 0, SIZE * 0.85);
    glow.addColorStop(0, `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.18)`);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, SIZE, SIZE);
  }

  // ── Decorative circles ───────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = style.text === "#ffffff" ? "#ffffff" : accent;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(SIZE - 80, 120, 280, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(SIZE - 80, 120, 200, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 0.04;
  ctx.beginPath(); ctx.arc(80, SIZE - 100, 300, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // ── Top accent bar ───────────────────────────────────────────────────────
  const barGrad = ctx.createLinearGradient(0, 0, SIZE, 0);
  barGrad.addColorStop(0, "transparent");
  barGrad.addColorStop(0.3, accent);
  barGrad.addColorStop(0.7, accent);
  barGrad.addColorStop(1, "transparent");
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, SIZE, 8);

  // ── ODM Groove branding (top-left) ──────────────────────────────────────
  ctx.fillStyle = "#c8a84b";
  ctx.font = "bold 28px sans-serif";
  ctx.letterSpacing = "0.2em";
  ctx.fillText("ODM GROOVE", 70, 80);
  ctx.fillStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.9)`;
  ctx.font = "500 22px sans-serif";
  ctx.fillText("× VDJ TIKO", 70, 115);
  ctx.letterSpacing = "0";

  // ── Category badge ───────────────────────────────────────────────────────
  const badgeText = event.ageLimit ? `${event.ageLimit}+ ONLY` : "LIVE EVENT";
  ctx.save();
  drawRoundedRect(ctx, 70, 165, ctx.measureText(badgeText).width + 40, 42, 21);
  ctx.fillStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.2)`;
  ctx.fill();
  ctx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.5)`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = accent;
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(badgeText, 90, 192);

  // ── Main title ───────────────────────────────────────────────────────────
  ctx.fillStyle = style.text;
  ctx.font = `bold 115px serif`;
  ctx.fillText(event.title, 70, 360);

  // ── Subtitle ─────────────────────────────────────────────────────────────
  ctx.fillStyle = accent;
  ctx.font = `italic bold 72px serif`;
  const subtitleWords = event.subtitle.split(" ");
  // Wrap if too long
  let line = "";
  let y = 450;
  for (const word of subtitleWords) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > SIZE - 140 && line) {
      ctx.fillText(line.trim(), 70, y); y += 82; line = word + " ";
    } else { line = test; }
  }
  if (line.trim()) { ctx.fillText(line.trim(), 70, y); }

  // ── Divider ───────────────────────────────────────────────────────────────
  const dividerY = y + 50;
  ctx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.35)`;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(70, dividerY); ctx.lineTo(SIZE - 70, dividerY); ctx.stroke();

  // ── Event details grid ────────────────────────────────────────────────────
  const detailY = dividerY + 55;
  const details = [
    { emoji: "📅", label: "DATE",  value: formatEventDate(event.date) },
    { emoji: "⏰", label: "TIME",  value: `5PM ${event.endTime}` },
    { emoji: "📍", label: "VENUE", value: "Ijoko · Ogba-Ayo · Ogun State" },
  ];
  details.forEach((d, i) => {
    const x = 70 + i * 330;
    ctx.fillStyle = style.sub;
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(`${d.emoji}  ${d.label}`, x, detailY);
    ctx.fillStyle = style.text;
    ctx.font = "500 22px sans-serif";
    // Wrap long venue
    if (d.value.length > 20 && i === 2) {
      ctx.fillText("Ijoko · Ogba-Ayo", x, detailY + 32);
      ctx.fillText("Ogun State", x, detailY + 58);
    } else {
      ctx.fillText(d.value, x, detailY + 35);
    }
  });

  // ── Ticket prices ─────────────────────────────────────────────────────────
  const ticketY = detailY + 120;
  ctx.fillStyle = style.sub;
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("🎟  TICKETS", 70, ticketY);

  event.ticketPrices.forEach((t, i) => {
    const tx = 70 + i * 240;
    // Price card bg
    ctx.save();
    drawRoundedRect(ctx, tx, ticketY + 16, 210, 80, 12);
    ctx.fillStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.15)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.3)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = style.sub;
    ctx.font = "500 20px sans-serif";
    ctx.fillText(t.label, tx + 18, ticketY + 44);
    ctx.fillStyle = accent;
    ctx.font = `bold 36px serif`;
    ctx.fillText(`₦${t.price.toLocaleString()}`, tx + 18, ticketY + 82);
  });

  // ── CTA / Reserve block ───────────────────────────────────────────────────
  const ctaY = ticketY + 130;
  ctx.save();
  drawRoundedRect(ctx, 70, ctaY, SIZE - 140, 80, 14);
  const ctaGrad = ctx.createLinearGradient(70, 0, SIZE - 70, 0);
  ctaGrad.addColorStop(0, "#c8a84b");
  ctaGrad.addColorStop(1, "#e2c97e");
  ctx.fillStyle = ctaGrad;
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "bold 34px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("RESERVE YOUR SPOT → 07061514120 · 09049180725", SIZE / 2, ctaY + 50);
  ctx.textAlign = "left";

  // ── Hashtags ──────────────────────────────────────────────────────────────
  const tagY = ctaY + 118;
  ctx.fillStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.6)`;
  ctx.font = "500 22px sans-serif";
  ctx.fillText(event.hashtags.slice(0, 5).join("  "), 70, tagY);

  // ── Bottom URL ────────────────────────────────────────────────────────────
  ctx.fillStyle = style.sub;
  ctx.font = "500 22px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`odmgroove.vercel.app/events/${event.id}`, SIZE - 70, SIZE - 38);
  ctx.textAlign = "left";

  // ── Bottom accent bar ────────────────────────────────────────────────────
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, SIZE - 8, SIZE, 8);
}

export default function ShareCardGenerator({ event }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStyle, setActiveStyle] = useState<string>("dark");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(
    (styleId: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setIsGenerating(true);
      setIsReady(false);

      // Small delay so UI updates first
      requestAnimationFrame(() => {
        try {
          drawCard(canvas, event, styleId);
          const url = canvas.toDataURL("image/png");
          setDownloadUrl(url);
          setIsReady(true);
        } catch (e) {
          console.error("Card generation failed", e);
        } finally {
          setIsGenerating(false);
        }
      });
    },
    [event]
  );

  useEffect(() => {
    generate(activeStyle);
  }, [activeStyle, generate]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `odm-groove-${event.id}-sharecard.png`;
    link.href = downloadUrl;
    link.click();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-5 border-b border-[var(--dark-border)]"
        style={{ background: `linear-gradient(135deg, var(--dark) 0%, ${event.accentColor}12 100%)` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${event.accentColor}20`, border: `1px solid ${event.accentColor}40` }}
          >
            <ImageIcon size={16} style={{ color: event.accentColor }} />
          </div>
          <div>
            <h3 className="text-[var(--off-white)] font-bold text-base">WhatsApp Share Card</h3>
            <p className="text-[var(--warm-gray)] text-xs">
              Generate a 1080×1080 image — save it, forward it, post it as Status
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Style switcher */}
        <div>
          <p className="text-[var(--warm-gray)] text-xs uppercase tracking-wider font-medium mb-3">Card Style</p>
          <div className="flex gap-2 flex-wrap">
            {CARD_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStyle(s.id)}
                className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                style={
                  activeStyle === s.id
                    ? { background: event.accentColor, color: "#0a0a0a", border: `1px solid ${event.accentColor}` }
                    : { background: "var(--dark)", color: "var(--warm-gray)", border: "1px solid var(--dark-border)" }
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas preview */}
        <div className="relative rounded-lg overflow-hidden border border-[var(--dark-border)] bg-[var(--dark)]">
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--dark)]/80 z-10">
              <RefreshCw size={24} className="text-[var(--gold)] animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ maxHeight: 380, objectFit: "contain" }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={!isReady || isGenerating}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-40"
            style={{
              background: isReady ? event.accentColor : "var(--dark-border)",
              color: isReady ? "#0a0a0a" : "var(--warm-gray)",
            }}
          >
            {copied ? (
              <><Check size={15} /> Saved! Forward on WhatsApp 🚀</>
            ) : (
              <><Download size={15} /> Save Image</>
            )}
          </button>
        </div>

        <p className="text-[var(--text-muted)] text-xs text-center leading-relaxed">
          Save the image → open WhatsApp → send in groups or post as Status
          <br />
          Works on every phone without any app — just a photo people can forward.
        </p>
      </div>
    </div>
  );
}
