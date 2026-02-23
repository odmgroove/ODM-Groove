"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  Search,
  ArrowLeft,
  Send,
  Bell,
} from "lucide-react";
import { menuCategories, menuItems, MenuItem } from "./menuData";

type CartItem = MenuItem & { qty: number };
type OrderType = "table" | "takeaway" | "delivery";

function formatPrice(n: number) {
  return n.toLocaleString("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 });
}

// ─── Item Card ───────────────────────────────────────────────────────────────
function ItemCard({ item, qty, onAdd, onIncrease, onDecrease }: {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="menu-card group relative flex flex-col rounded-2xl overflow-hidden border border-[var(--dark-border)] bg-[var(--dark-card)] hover:border-[var(--gold)]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--gold)]/5">
      {/* Background gradient emoij area */}
      <div className="relative h-32 flex items-center justify-center bg-gradient-to-br from-[var(--dark)] to-[var(--dark-card)] overflow-hidden">
        <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-500">
          {item.emoji}
        </span>
        {item.tag && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full
            ${item.tag === "popular" ? "bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30" :
              item.tag === "vip" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
              "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"}`}>
            {item.tag === "popular" ? "⭐ Popular" : item.tag === "vip" ? "👑 VIP" : "✨ New"}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        {item.subcategory && (
          <span className="text-[10px] uppercase tracking-widest text-[var(--warm-gray)] font-medium">
            {item.subcategory}
          </span>
        )}
        <p className="font-semibold text-[var(--off-white)] leading-snug text-sm line-clamp-2">
          {item.name}
        </p>
        {item.description && (
          <p className="text-[11px] text-[var(--warm-gray)] leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-bold text-[var(--gold)] text-base font-display">
            {item.price === 0 ? "Enquire" : formatPrice(item.price)}
          </span>

          {qty === 0 ? (
            <button
              onClick={onAdd}
              disabled={item.price === 0}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200
                ${item.price === 0
                  ? "bg-[var(--dark-border)] text-[var(--warm-gray)] cursor-not-allowed"
                  : "bg-[var(--gold)] text-[var(--black)] hover:bg-[var(--gold-light)] hover:shadow-lg hover:shadow-[var(--gold)]/20 active:scale-95"
                }`}
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus size={13} />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-[var(--dark)] border border-[var(--gold)]/30 rounded-lg overflow-hidden">
              <button
                onClick={onDecrease}
                className="w-8 h-8 flex items-center justify-center text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={12} />
              </button>
              <span className="w-7 text-center text-sm font-bold text-[var(--gold)]">{qty}</span>
              <button
                onClick={onIncrease}
                className="w-8 h-8 flex items-center justify-center text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Order Drawer ─────────────────────────────────────────────────────────────
function OrderDrawer({
  cart,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  cart: CartItem[];
  onClose: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [orderType, setOrderType] = useState<OrderType>("table");
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [sending, setSending] = useState(false);

  const grandTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const sendOrder = () => {
    if (!name.trim()) return;
    setSending(true);

    const typeLabel =
      orderType === "table"
        ? `🪑 Table${table ? ` (${table})` : ""}`
        : orderType === "takeaway"
        ? "🥡 Takeaway"
        : `🚚 Delivery${address ? ` — ${address}` : ""}`;

    const itemLines = cart
      .map((i) => `• ${i.qty}× ${i.name} — ${formatPrice(i.price * i.qty)}`)
      .join("\n");

    const msg = [
      "🏨 *ODM GROOVE — NEW ORDER*",
      "━━━━━━━━━━━━━━━━━━━━━",
      `📋 *Order Type:* ${typeLabel}`,
      `👤 *Name:* ${name.trim()}`,
      "",
      "🛒 *Items Ordered:*",
      itemLines,
      "",
      "━━━━━━━━━━━━━━━━━━━━━",
      `💰 *Grand Total: ${formatPrice(grandTotal)}*`,
      message ? `📝 *Note:* ${message.trim()}` : "",
      "━━━━━━━━━━━━━━━━━━━━━",
      "_Sent via ODM Groove website_",
    ]
      .filter((l) => l !== "")
      .join("\n");

    const url = `https://wa.me/2347061514120?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setTimeout(() => setSending(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full md:w-[420px] h-[92vh] md:h-full bg-[var(--dark)] border-t md:border-t-0 md:border-l border-[var(--dark-border)] flex flex-col rounded-t-3xl md:rounded-none shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-[var(--dark-border)] shrink-0">
          {step === "checkout" && (
            <button
              onClick={() => setStep("cart")}
              className="text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors"
              aria-label="Back to cart"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold text-[var(--off-white)]">
              {step === "cart" ? "Your Order" : "Confirm & Send"}
            </h2>
            <p className="text-xs text-[var(--warm-gray)]">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--dark-card)] text-[var(--warm-gray)] hover:text-[var(--off-white)] hover:bg-[var(--dark-border)] transition-all"
            aria-label="Close order panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* ScrollBody */}
        <div className="flex-1 overflow-y-auto">
          {step === "cart" ? (
            // ── Cart Items ──────────────────────────────────────────────────
            <div className="p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--dark-card)] border border-[var(--dark-border)]"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--off-white)] truncate">{item.name}</p>
                    <p className="text-xs text-[var(--gold)]">{formatPrice(item.price)} each</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex items-center gap-1 bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg overflow-hidden">
                      <button
                        onClick={() => onDecrease(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors"
                        aria-label={`Decrease ${item.name}`}
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-[var(--off-white)]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onIncrease(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors"
                        aria-label={`Increase ${item.name}`}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="w-7 h-7 ml-1 flex items-center justify-center rounded-lg text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-400/10 transition-all"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // ── Checkout Form ──────────────────────────────────────────────
            <div className="p-5 space-y-5">
              {/* Order Summary */}
              <div className="rounded-xl bg-[var(--dark-card)] border border-[var(--dark-border)] p-4 space-y-2 max-h-40 overflow-y-auto">
                {cart.map((i) => (
                  <div key={i.id} className="flex justify-between text-xs">
                    <span className="text-[var(--warm-gray)]">
                      {i.qty}× {i.name}
                    </span>
                    <span className="text-[var(--off-white)] font-medium">
                      {formatPrice(i.price * i.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-3">
                  Order Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["table", "takeaway", "delivery"] as OrderType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setOrderType(t)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all text-xs font-semibold
                        ${orderType === t
                          ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                          : "border-[var(--dark-border)] text-[var(--warm-gray)] hover:border-[var(--gold)]/40"
                        }`}
                    >
                      <span className="text-lg">
                        {t === "table" ? "🪑" : t === "takeaway" ? "🥡" : "🚚"}
                      </span>
                      {t === "table" ? "Table" : t === "takeaway" ? "Takeaway" : "Delivery"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-[var(--off-white)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>

                {orderType === "table" && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">
                      Table Name / Number
                    </label>
                    <input
                      type="text"
                      value={table}
                      onChange={(e) => setTable(e.target.value)}
                      placeholder="e.g. Table 5 or Balcony"
                      className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-[var(--off-white)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                    />
                  </div>
                )}

                {orderType === "delivery" && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your delivery address"
                      className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-[var(--off-white)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">
                    Special Instructions (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any special requests or notes..."
                    rows={3}
                    className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-[var(--off-white)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--dark-border)] p-5 space-y-4 shrink-0 bg-[var(--dark)]">
          {/* Grand Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--warm-gray)] uppercase tracking-wider">
              Grand Total
            </span>
            <span className="font-display text-2xl font-bold text-[var(--gold)]">
              {formatPrice(grandTotal)}
            </span>
          </div>

          {step === "cart" ? (
            <button
              onClick={() => setStep("checkout")}
              className="w-full btn-gold flex items-center justify-center gap-2 py-3.5"
            >
              Proceed to Order
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={sendOrder}
              disabled={!name.trim() || sending}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-sm font-bold text-sm tracking-wider uppercase transition-all
                ${!name.trim() || sending
                  ? "bg-[var(--dark-border)] text-[var(--warm-gray)] cursor-not-allowed"
                  : "btn-gold"
                }`}
            >
              {sending ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Opening WhatsApp...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Send Order via WhatsApp
                </>
              )}
            </button>
          )}
          <p className="text-center text-[10px] text-[var(--warm-gray)]">
            Your order will be sent to our team on WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Call Waiter Modal ───────────────────────────────────────────────────────
function CallWaiterModal({ onClose }: { onClose: () => void }) {
  const [tableNo, setTableNo] = useState("");
  const [sent, setSent] = useState(false);

  const notify = () => {
    if (!tableNo.trim()) return;
    const msg = [
      "🔔 *WAITER NEEDED — ODM GROOVE*",
      "━━━━━━━━━━━━━━━━━━━━━",
      `🪑 *Table:* ${tableNo.trim()}`,
      "",
      "A guest at this table is requesting a waiter. Please attend to them promptly.",
      "━━━━━━━━━━━━━━━━━━━━━",
      "_Sent via ODM Groove website_",
    ].join("\n");
    window.open(`https://wa.me/2347061514120?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[var(--dark)] border border-[var(--dark-border)] rounded-3xl shadow-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--gold-dark)] via-[var(--gold)] to-[var(--gold-light)]" />

        <div className="p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--dark-card)] text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>

          {/* Icon + title */}
          <div className="flex flex-col items-center gap-3 mb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center">
              <Bell size={28} className="text-[var(--gold)]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--off-white)]">Call a Waiter</h2>
              <p className="text-xs text-[var(--warm-gray)] mt-1">Enter your table number and we&apos;ll send someone over right away.</p>
            </div>
          </div>

          {/* Table input */}
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--warm-gray)] mb-2">
              Table Name / Number *
            </label>
            <input
              type="text"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && notify()}
              placeholder="e.g. Table 5, VIP 2, Poolside"
              autoFocus
              className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-[var(--off-white)] placeholder:text-[var(--warm-gray)] focus:outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          {/* Send button */}
          <button
            onClick={notify}
            disabled={!tableNo.trim() || sent}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all
              ${sent
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                : !tableNo.trim()
                ? "bg-[var(--dark-border)] text-[var(--warm-gray)] cursor-not-allowed"
                : "bg-[var(--gold)] text-[var(--black)] hover:bg-[var(--gold-light)] hover:shadow-lg hover:shadow-[var(--gold)]/20 active:scale-[0.98]"
              }`}
          >
            {sent ? (
              <><span>✅</span> Waiter Notified!</>
            ) : (
              <><Bell size={15} /> Notify Waiter via WhatsApp</>
            )}
          </button>

          <p className="text-center text-[10px] text-[var(--warm-gray)] mt-3">
            A notification will be sent instantly to our service team
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
export default function MenuClient() {
  const [activeCategory, setActiveCategory] = useState("food");
  const [search, setSearch] = useState("");
  const [waiterModalOpen, setWaiterModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const categoryBarRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const grandTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Scroll active category pill into view
  useEffect(() => {
    if (!categoryBarRef.current) return;
    const active = categoryBarRef.current.querySelector("[data-active='true']") as HTMLElement;
    if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCategory]);

  const visibleItems = useMemo(() => {
    const byCat = menuItems.filter((i) => i.category === activeCategory);
    if (!search.trim()) return byCat;
    const q = search.toLowerCase();
    return byCat.filter((i) => i.name.toLowerCase().includes(q));
  }, [activeCategory, search]);

  const getQty = (id: string) => cart.find((c) => c.id === id)?.qty ?? 0;

  const addItem = (item: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseItem = (id: string) =>
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: c.qty + 1 } : c));

  const decreaseItem = (id: string) =>
    setCart((prev) =>
      prev
        .map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c)
        .filter((c) => c.qty > 0)
    );

  const removeItem = (id: string) =>
    setCart((prev) => prev.filter((c) => c.id !== id));

  const activeCat = menuCategories.find((c) => c.id === activeCategory);

  // Group items by subcategory
  const subcategories = useMemo(() => {
    const subs = new Map<string, MenuItem[]>();
    for (const item of visibleItems) {
      const key = item.subcategory ?? "__none__";
      if (!subs.has(key)) subs.set(key, []);
      subs.get(key)!.push(item);
    }
    return subs;
  }, [visibleItems]);

  return (
    <div className="min-h-screen bg-[var(--black)] flex flex-col">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[var(--black)]/95 backdrop-blur-xl border-b border-[var(--dark-border)] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo / Back */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors group shrink-0"
            aria-label="Back to home"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:block text-xs uppercase tracking-widest font-medium">Back</span>
          </Link>

          {/* Logo Center */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="relative inline-block w-20 h-3.5 md:w-28 md:h-5">
              <Image src="/logo.png" alt="ODM Groove" fill className="object-contain" priority />
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-[var(--warm-gray)] font-medium mt-0.5">
              Menu & Order
            </span>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => cart.length > 0 && setDrawerOpen(true)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 shrink-0
              ${cartCount > 0
                ? "bg-[var(--gold)] text-[var(--black)] shadow-lg shadow-[var(--gold)]/20 hover:bg-[var(--gold-light)]"
                : "bg-[var(--dark-card)] border border-[var(--dark-border)] text-[var(--warm-gray)]"
              }`}
            aria-label={`Cart — ${cartCount} items`}
          >
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <span className="text-xs font-bold">{cartCount}</span>
            )}
            {cartCount > 0 && grandTotal > 0 && (
              <span className="hidden sm:block text-xs font-semibold">
                {formatPrice(grandTotal)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className="relative h-44 md:h-56 overflow-hidden">
        {activeCat?.heroImage ? (
          <Image
            src={activeCat.heroImage}
            alt={activeCat.label}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${activeCat?.gradient ?? "from-[var(--dark)] to-[var(--dark-card)]"}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)] via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 text-center px-4">
          <span className="text-5xl mb-2">{activeCat?.emoji}</span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            {activeCat?.label}
          </h1>
          <p className="text-xs text-white/70 mt-1">{activeCat?.description}</p>
        </div>
      </div>

      {/* ── Category Tabs ────────────────────────────────────────────────────── */}
      <div
        ref={categoryBarRef}
        className="sticky top-16 z-30 bg-[var(--black)]/95 backdrop-blur-lg border-b border-[var(--dark-border)] px-4 py-3"
      >
        <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-7xl mx-auto">
          {menuCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                data-active={isActive}
                onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shrink-0 text-xs font-semibold tracking-wide transition-all duration-200
                  ${isActive
                    ? "bg-[var(--gold)] text-[var(--black)] shadow-lg shadow-[var(--gold)]/20"
                    : "bg-[var(--dark-card)] text-[var(--warm-gray)] border border-[var(--dark-border)] hover:border-[var(--gold)]/40 hover:text-[var(--off-white)]"
                  }`}
                aria-pressed={isActive}
                aria-label={cat.label}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search Bar ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 pb-2">
        <div className={`flex items-center gap-3 bg-[var(--dark-card)] border rounded-xl px-4 py-3 transition-all duration-200
          ${searchFocused ? "border-[var(--gold)]/50 shadow-lg shadow-[var(--gold)]/5" : "border-[var(--dark-border)]"}`}>
          <Search size={16} className="text-[var(--warm-gray)] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={`Search in ${activeCat?.label ?? "menu"}…`}
            className="flex-1 bg-transparent text-sm text-[var(--off-white)] placeholder:text-[var(--warm-gray)] outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[var(--warm-gray)] hover:text-[var(--off-white)]">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Menu Grid ────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 pb-32">
        {visibleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <span className="text-6xl">🍽️</span>
            <p className="text-[var(--warm-gray)] text-sm">No items found. Try a different search.</p>
          </div>
        ) : (
          // Render by subcategory groupings
          Array.from(subcategories).map(([sub, items]) => (
            <div key={sub} className="mb-10">
              {sub !== "__none__" && (
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-display text-lg font-bold text-[var(--off-white)]">{sub}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--gold)]/30 to-transparent" />
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    qty={getQty(item.id)}
                    onAdd={() => addItem(item)}
                    onIncrease={() => increaseItem(item.id)}
                    onDecrease={() => decreaseItem(item.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* ── Floating Cart Bar (mobile, if items in cart) ─────────────────────── */}
      {cartCount > 0 && !drawerOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-2 bg-gradient-to-t from-[var(--black)] to-transparent pointer-events-none">
          <button
            onClick={() => setDrawerOpen(true)}
            className="pointer-events-auto w-full max-w-lg mx-auto flex items-center justify-between btn-gold py-4 px-6 rounded-2xl shadow-2xl shadow-[var(--gold)]/20"
            aria-label={`View order — ${cartCount} items`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-[var(--black)]/20 rounded-full flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
              <span className="font-semibold text-sm uppercase tracking-wider">View Order</span>
            </div>
            <span className="font-display font-bold text-lg">{formatPrice(grandTotal)}</span>
          </button>
        </div>
      )}

      {/* ── Special category info banners ─────────────────────────────────── */}
      {(activeCategory === "swimming" || activeCategory === "snooker" || activeCategory === "club") && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-4">
          <div className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold)]/5 p-5 flex gap-4 items-start">
            <span className="text-3xl">{activeCat?.emoji}</span>
            <div>
              <p className="font-semibold text-[var(--off-white)] mb-1">{activeCat?.label}</p>
              <p className="text-sm text-[var(--warm-gray)]">
                {activeCategory === "swimming" && "Pool sessions can be added to your order. Our beautiful swimming pool is open daily."}
                {activeCategory === "snooker" && "Snooker is charged per coin. Add coins to your order and we'll set you up at a table."}
                {activeCategory === "club" && "Club & Rooftop events may have varying entry prices. Please enquire at the front desk or call us."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Drawer ─────────────────────────────────────────────────────── */}
      {drawerOpen && (
        <OrderDrawer
          cart={cart}
          onClose={() => setDrawerOpen(false)}
          onIncrease={increaseItem}
          onDecrease={decreaseItem}
          onRemove={removeItem}
        />
      )}

      {/* ── Floating Call Waiter button (bottom-right) ───────────────────────── */}
      {!drawerOpen && !waiterModalOpen && (
        <button
          onClick={() => setWaiterModalOpen(true)}
          className="fixed bottom-6 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[var(--dark-card)] border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-semibold shadow-2xl hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] transition-all duration-200 group"
          aria-label="Call a waiter"
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold)] opacity-25" />
            <Bell size={14} className="relative" />
          </span>
          <span className="hidden sm:inline">Call Waiter</span>
        </button>
      )}

      {/* ── Call Waiter Modal ────────────────────────────────────────────────── */}
      {waiterModalOpen && (
        <CallWaiterModal onClose={() => setWaiterModalOpen(false)} />
      )}
    </div>
  );
}
