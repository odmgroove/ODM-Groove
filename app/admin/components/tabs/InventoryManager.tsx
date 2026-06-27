"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Package, Plus, ArrowRightLeft, History, AlertTriangle, Save,
  Trash2, Edit2, X, Check, Search, ChevronDown, RotateCcw, Filter,
  ShoppingCart, Minus, MapPin, RefreshCw, Calendar
} from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";
import CustomSelect from "../../../components/CustomSelect";

import DatePicker from "@/app/components/DatePicker";

// ─── Types ────────────────────────────────────────────────────────────────────

type InventoryItem = {
  id: string;
  name: string;
  sku: string | null;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  mainStoreCount: number;
  frontStoreCount: number;
  lowStockAlert: number;
  available: boolean;
  purchaseUnit: string;
  unitsPerPurchaseUnit: number;
};

type Transfer = {
  id: string;
  quantity: number;
  direction: string;
  note: string | null;
  createdAt: string;
  toLocationId: string | null;
  fromLocationId: string | null;
  item: { name: string; unit: string; category: string };
  transferredBy: { name: string | null; email: string };
};

type StoreLocation = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

type CartItem = {
  id: string;
  itemId: string;
  qty: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["Drinks", "Food Supplies", "Pool", "Snooker", "Toiletries", "Other"];
const UNITS = ["pcs", "bottles", "litres", "kg", "sets", "portions", "cans"];
const PURCHASE_UNITS = ["crates", "cartons", "packs", "bags", "bowls", "pcs"];

const DIRECTIONS = [
  { value: "location_transfer", label: "Store → Location (VIP/Rooftop/Bar)", color: "gold" },
  { value: "store_to_front",    label: "Store → Front (Generic)",           color: "blue" },
  { value: "front_to_store",    label: "Front → Main Store",                color: "purple" },
  { value: "receive",           label: "Receive Delivery",                  color: "green" },
  { value: "adjustment",        label: "Manual Adjustment",                 color: "amber" },
];

const DIR_COLORS: Record<string, string> = {
  location_transfer: "text-[var(--gold)] bg-[var(--gold)]/10 border-[var(--gold)]/30",
  store_to_front:    "text-blue-400 bg-blue-400/10 border-blue-400/30",
  front_to_store:    "text-purple-400 bg-purple-400/10 border-purple-400/30",
  receive:           "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  adjustment:        "text-amber-400 bg-amber-400/10 border-amber-400/30",
};

const DIR_LABEL: Record<string, string> = {
  location_transfer: "Store → Location",
  store_to_front:    "Store → Front",
  front_to_store:    "Front → Store",
  receive:           "New Delivery",
  adjustment:        "Adjustment",
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

function todayISO() { return new Date().toISOString().split("T")[0]; }
function daysAgoISO(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split("T")[0];
}

// ─── Password Reset Modal ─────────────────────────────────────────────────────

function ResetPasswordModal({ onConfirm, onCancel, staffEmail }: {
  onConfirm: (email: string, password: string) => void;
  onCancel: () => void;
  staffEmail: string;
}) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[var(--dark-card)] border border-red-500/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <RotateCcw size={18} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--off-white)]">Reset Stock Log</h3>
            <p className="text-xs text-[var(--warm-gray)]">This will permanently delete all transfer history</p>
          </div>
        </div>
        <p className="text-sm text-[var(--warm-gray)] mb-4">
          Enter your admin password to confirm this irreversible action.
        </p>
        <input
          type="password"
          placeholder="Your password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && pw && onConfirm(staffEmail, pw)}
          className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--off-white)] outline-none focus:border-red-500/50 mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={async () => { setLoading(true); await onConfirm(staffEmail, pw); setLoading(false); }}
            disabled={!pw || loading}
            className="flex-1 py-2.5 text-sm font-bold rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Confirm Reset"}
          </button>
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Expert Date Picker ───────────────────────────────────────────────────────

function DateRangeFilter({ from, to, onChange }: {
  from: string; to: string;
  onChange: (from: string, to: string) => void;
}) {
  const [showCustom, setShowCustom] = useState(false);
  const [activePreset, setActivePreset] = useState("all");

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    setShowCustom(false);
    switch (preset) {
      case "today":   return onChange(todayISO(), todayISO());
      case "week":    return onChange(daysAgoISO(7), todayISO());
      case "month":   return onChange(daysAgoISO(30), todayISO());
      case "3months": return onChange(daysAgoISO(90), todayISO());
      case "all":     return onChange("", "");
    }
  };

  const presets = [
    { key: "all",     label: "All Time" },
    { key: "today",   label: "Today" },
    { key: "week",    label: "Last 7 Days" },
    { key: "month",   label: "Last 30 Days" },
    { key: "3months", label: "Last 3 Months" },
    { key: "custom",  label: "Custom Range" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map(p => (
        <button
          key={p.key}
          onClick={() => p.key === "custom" ? (setShowCustom(true), setActivePreset("custom")) : applyPreset(p.key)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all
            ${activePreset === p.key
              ? "bg-[var(--gold)] text-black border-[var(--gold)]"
              : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/40 hover:text-[var(--off-white)]"}`}
        >
          {p.label}
        </button>
      ))}

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 ml-0 sm:ml-2 animate-fade-in w-full sm:w-auto">
          <div className="min-w-[140px] flex-1">
            <DatePicker
              selected={from ? new Date(from) : null}
              maxDate={to ? new Date(to) : new Date()}
              placeholder="From date"
              onSelect={d => {
                const tzOffset = d.getTimezoneOffset() * 60000;
                onChange(new Date(d.getTime() - tzOffset).toISOString().split('T')[0], to);
              }}
              className="w-full"
            />
          </div>
          <span className="text-[var(--warm-gray)] text-xs font-semibold uppercase hidden sm:inline">to</span>
          <div className="min-w-[140px] flex-1">
            <DatePicker
              selected={to ? new Date(to) : null}
              minDate={from ? new Date(from) : undefined}
              maxDate={new Date()}
              placeholder="To date"
              onSelect={d => {
                const tzOffset = d.getTimezoneOffset() * 60000;
                onChange(from, new Date(d.getTime() - tzOffset).toISOString().split('T')[0]);
              }}
              className="w-full"
            />
          </div>
        </div>
    </div>
  );
}


// ─── Main Component ───────────────────────────────────────────────────────────

export default function InventoryManager({ staffId, staffName, staffEmail }: {
  staffId: string; staffName: string; staffEmail?: string;
}) {
  const [activeTab, setActiveTab] = useState<"items" | "transfer" | "log" | "locations">("items");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<InventoryItem | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isAlertExpanded, setIsAlertExpanded] = useState(false);

  // ── Transfer (POS-Style Cart) State ──────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);
  const [globalDir, setGlobalDir] = useState<"location_transfer" | "store_to_front" | "front_to_store" | "receive" | "adjustment">("location_transfer");
  const [globalLocation, setGlobalLocation] = useState<string>(""); // target location ID for location_transfer
  const [globalNote, setGlobalNote] = useState("");
  const [transferSearch, setTransferSearch] = useState("");
  const [transferCatFilter, setTransferCatFilter] = useState("all");
  const [transferSuccess, setTransferSuccess] = useState(false);

  // ── New item form ─────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "", sku: "", category: "Drinks", unit: "bottles", purchaseUnit: "crates",
    unitsPerPurchaseUnit: 24, costPrice: 0, sellingPrice: 0,
    mainStoreCount: 0, frontStoreCount: 0, lowStockAlert: 5,
  });

  // ── Location form ────────────────────────────────────────────────────────
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationDesc, setNewLocationDesc] = useState("");
  const [addingLocation, setAddingLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<StoreLocation | null>(null);
  const [confirmDeleteLocation, setConfirmDeleteLocation] = useState<StoreLocation | null>(null);

  // ── Locations ─────────────────────────────────────────────────────────────
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  // ── Log Filter State ──────────────────────────────────────────────────────
  const [logFrom, setLogFrom] = useState("");
  const [logTo, setLogTo] = useState("");
  const [logDirFilter, setLogDirFilter] = useState("all");
  const [logLocationFilter, setLogLocationFilter] = useState("all");
  const [showResetModal, setShowResetModal] = useState(false);



  // ─── Data Fetching ────────────────────────────────────────────────────────

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/inventory/items");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  const fetchTransfers = async (from = "", to = "", direction = "all", locationId = "all") => {
    setLogLoading(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from + "T00:00:00.000Z");
    if (to)   params.set("to",   to   + "T23:59:59.999Z");
    if (direction && direction !== "all") params.set("direction", direction);
    if (locationId && locationId !== "all") params.set("locationId", locationId);
    const res = await fetch(`/api/inventory/transfers?${params}`);
    if (res.ok) setTransfers(await res.json());
    setLogLoading(false);
  };

  const fetchLocations = async () => {
    setLocationsLoading(true);
    const res = await fetch("/api/inventory/locations");
    if (res.ok) setLocations(await res.json());
    setLocationsLoading(false);
  };

  useEffect(() => { fetchItems(); fetchTransfers(); fetchLocations(); }, []);

  // Re-fetch log when filters change
  useEffect(() => {
    if (activeTab === "log") fetchTransfers(logFrom, logTo, logDirFilter, logLocationFilter);
  }, [logFrom, logTo, logDirFilter, logLocationFilter, activeTab]);

  // ─── CRUD Handlers ────────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!form.name.trim()) { setAlertMessage("Item name is required."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/inventory/items", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsAdding(false);
        setForm({ name: "", sku: "", category: "Drinks", unit: "bottles", purchaseUnit: "crates", unitsPerPurchaseUnit: 24, costPrice: 0, sellingPrice: 0, mainStoreCount: 0, frontStoreCount: 0, lowStockAlert: 5 });
        await fetchItems();
        setSuccessMessage("Item created successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else { const e = await res.json(); setAlertMessage(e.error || "Failed to create item."); }
    } catch { setAlertMessage("An unexpected error occurred."); }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/inventory/items/${editing.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name, sku: editing.sku, category: editing.category, unit: editing.unit,
          purchaseUnit: editing.purchaseUnit, unitsPerPurchaseUnit: editing.unitsPerPurchaseUnit,
          costPrice: editing.costPrice, sellingPrice: editing.sellingPrice,
          mainStoreCount: editing.mainStoreCount, frontStoreCount: editing.frontStoreCount,
          lowStockAlert: editing.lowStockAlert, available: editing.available,
        }),
      });
      if (res.ok) {
        setEditing(null); await fetchItems();
        setSuccessMessage("Item updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else { const e = await res.json(); setAlertMessage(e.error || "Failed to update item."); }
    } catch { setAlertMessage("An unexpected error occurred."); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/inventory/items/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmDelete(null); await fetchItems();
        setSuccessMessage("Item deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else { setAlertMessage(`Error deleting item: ${await res.text()}`); }
    } catch { setAlertMessage("An error occurred while deleting."); }
  };

  // ─── POS Transfer Handlers ────────────────────────────────────────────────

  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.itemId === item.id);
      if (existing) return prev.map(c => c.itemId === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: Date.now().toString(), itemId: item.id, qty: 1 }];
    });
  };

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(c => c.itemId !== itemId));
    } else {
      setCart(prev => prev.map(c => c.itemId === itemId ? { ...c, qty } : c));
    }
  };

  const handleTransfer = async () => {
    if (cart.length === 0) { setAlertMessage("Add at least one item to the transfer cart."); return; }
    if (globalDir === "location_transfer" && !globalLocation) {
      setAlertMessage("Please select a target location (VIP, Rooftop, Main Bar, etc.) before confirming.");
      return;
    }
    setSaving(true);
    const cartSnapshot = [...cart];
    let hasError = false;
    for (const cartItem of cartSnapshot) {
      const res = await fetch("/api/inventory/transfers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: cartItem.itemId,
          quantity: cartItem.qty,
          direction: globalDir,
          note: globalNote.trim() || null,
          userId: staffId,
          toLocationId: globalDir === "location_transfer" ? globalLocation : null,
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        hasError = true;
        setAlertMessage(`Error: ${e.error || "Transfer failed"}`);
        break;
      }
    }
    if (!hasError) {
      setCart([]);
      setGlobalNote("");
      setTransferSuccess(true);
      await fetchItems();
      fetchTransfers(logFrom, logTo, logDirFilter, logLocationFilter);
      setSuccessMessage(`${cartSnapshot.length} item(s) transferred successfully!`);
      setTimeout(() => { setSuccessMessage(null); setTransferSuccess(false); }, 3000);
    }
    setSaving(false);
  };

  // ─── Log Reset Handler ────────────────────────────────────────────────────

  const handleResetLog = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/inventory/reset", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowResetModal(false);
        setTransfers([]);
        setSuccessMessage(`Stock log cleared. ${data.deletedCount} records removed.`);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setShowResetModal(false);
        setAlertMessage(data.error || "Failed to reset log.");
      }
    } catch {
      setShowResetModal(false);
      setAlertMessage("A network error occurred.");
    }
  };

  const handleUpdateLocation = async () => {
    if (!editingLocation || !editingLocation.name.trim()) return;
    try {
      const res = await fetch(`/api/inventory/locations/${editingLocation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: editingLocation.name.trim(), 
          description: editingLocation.description?.trim() || null,
          isActive: editingLocation.isActive 
        }),
      });
      if (res.ok) {
        setEditingLocation(null);
        await fetchLocations();
        setSuccessMessage("Location updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const e = await res.json();
        setAlertMessage(e.error || "Failed to update location.");
      }
    } catch {
      setAlertMessage("Network error updating location.");
    }
  };

  const handleDeleteLocation = async () => {
    if (!confirmDeleteLocation) return;
    try {
      const res = await fetch(`/api/inventory/locations/${confirmDeleteLocation.id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmDeleteLocation(null);
        await fetchLocations();
        setSuccessMessage("Location deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const e = await res.json();
        setConfirmDeleteLocation(null);
        setAlertMessage(e.error || "Failed to delete location.");
      }
    } catch {
      setConfirmDeleteLocation(null);
      setAlertMessage("Network error deleting location.");
    }
  };

  // ─── Derived Data ─────────────────────────────────────────────────────────

  const lowStockItems = items.filter(i => i.frontStoreCount <= i.lowStockAlert && i.available);
  const categories = [...new Set(items.map(i => i.category))];
  const filteredItems = categoryFilter === "all" ? items : items.filter(i => i.category === categoryFilter);

  const transferGridItems = useMemo(() => {
    let list = transferCatFilter === "all" ? items : items.filter(i => i.category === transferCatFilter);
    if (transferSearch.trim()) {
      const q = transferSearch.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }
    return list;
  }, [items, transferCatFilter, transferSearch]);

  const cartTotal = cart.reduce((sum, c) => {
    const item = items.find(i => i.id === c.itemId);
    return sum + (item ? c.qty * (item.unitsPerPurchaseUnit > 1 && (globalDir === "receive" || globalDir === "store_to_front") ? item.unitsPerPurchaseUnit : 1) : 0);
  }, 0);

  // Helper: get location name from id
  const getLocationName = (id: string | null) => {
    if (!id) return null;
    return locations.find(l => l.id === id)?.name || null;
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-6 pb-20 space-y-0">

      {/* ── Unified Sticky Header ── */}
      <div className="sticky top-0 z-20 bg-[var(--black)]/95 backdrop-blur-md pb-3 pt-6 -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-6 border-b border-[var(--dark-border)] mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>Inventory</h2>
            <p className="text-sm text-[var(--warm-gray)] mt-1">Manage stock, transfers, and store locations.</p>
          </div>
          {activeTab === "items" && (
            <button onClick={() => setIsAdding(true)} className="btn-gold px-4 py-2 flex items-center gap-2 text-sm">
              <Plus size={16} /> Add Item
            </button>
          )}
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-red-400">Low Stock Alert ({lowStockItems.length} items)</p>
                <button onClick={() => setIsAlertExpanded(!isAlertExpanded)} className="text-[10px] uppercase font-bold tracking-wider text-red-400 hover:text-red-300">
                  {isAlertExpanded ? "Hide" : "Show Details"}
                </button>
              </div>
              {isAlertExpanded && (
                <p className="text-xs text-[var(--warm-gray)] mt-1.5 leading-relaxed">
                  {lowStockItems.map(i => `${i.name} (${i.frontStoreCount} ${i.unit} left)`).join(" · ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Sub-tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x">
          {[
            { key: "items",    label: "Stock Items",       icon: <Package size={14} /> },
            { key: "transfer", label: "Transfer / Receive", icon: <ArrowRightLeft size={14} /> },
            { key: "log",      label: "Stock Log",          icon: <History size={14} /> },
            { key: "locations",label: "Locations",           icon: <MapPin size={14} /> },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all
                ${activeTab === t.key ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/40"}`}>
              {t.icon} {t.label}
              {t.key === "transfer" && cart.length > 0 && (
                <span className="ml-1 bg-black/30 text-xs font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Items Tab — sticky category filters */}
        {activeTab === "items" && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar pt-1">
            {["all", ...categories].map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all capitalize
                  ${categoryFilter === cat ? "bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/40" : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/30"}`}>
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        )}

        {/* Transfer Tab — sticky search + category filters */}
        {activeTab === "transfer" && (
          <div className="space-y-2 pt-1">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
              <input
                type="text"
                placeholder="Search items..."
                value={transferSearch}
                onChange={e => setTransferSearch(e.target.value)}
                className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-9 pr-4 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]/50"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {["all", ...categories].map(cat => (
                <button key={cat} onClick={() => setTransferCatFilter(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all capitalize
                    ${transferCatFilter === cat ? "bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/40" : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/30"}`}>
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Items Tab ── */}
      {activeTab === "items" && (
        <div className="space-y-4">
          {isAdding && (
            <div className="bg-[var(--dark-card)] border border-[var(--gold)]/30 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-[var(--off-white)] flex items-center gap-2"><Plus size={15} className="text-[var(--gold)]" /> New Inventory Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: "Item Name *", field: "name", type: "text", placeholder: "e.g. Hennessy V.S" },
                  { label: "SKU Code", field: "sku", type: "text", placeholder: "e.g. BAR-HEN-VS" },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs text-[var(--warm-gray)] mb-1">{label}</label>
                    <input type={type} value={(form as Record<string, string | number>)[field] as string}
                      onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder}
                      className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-[var(--warm-gray)] mb-1">Category</label>
                  <CustomSelect value={form.category} onChange={v => setForm({ ...form, category: v })} options={CATEGORIES.map(c => ({ value: c, label: c }))} />
                </div>
                <div>
                  <label className="block text-xs text-[var(--warm-gray)] mb-1">Sale Unit (e.g. bottles)</label>
                  <CustomSelect value={form.unit} onChange={v => setForm({ ...form, unit: v })} options={UNITS.map(u => ({ value: u, label: u }))} />
                </div>
                <div>
                  <label className="block text-xs text-[var(--warm-gray)] mb-1">Purchase Unit (e.g. crates)</label>
                  <CustomSelect value={form.purchaseUnit} onChange={v => setForm({ ...form, purchaseUnit: v })} options={PURCHASE_UNITS.map(u => ({ value: u, label: u }))} />
                </div>
                <div>
                  <label className="block text-xs text-[var(--warm-gray)] mb-1">Units per {form.purchaseUnit}</label>
                  <input type="number" min={1} value={form.unitsPerPurchaseUnit}
                    onChange={e => setForm({ ...form, unitsPerPurchaseUnit: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]" />
                </div>
                {[
                  { label: `Cost Price (₦) per ${form.purchaseUnit}`, field: "costPrice" },
                  { label: `Selling Price (₦) per ${form.unit}`, field: "sellingPrice" },
                  { label: "Main Store Count", field: "mainStoreCount" },
                  { label: "Front Store Count", field: "frontStoreCount" },
                  { label: "Low Stock Alert at", field: "lowStockAlert" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-xs text-[var(--warm-gray)] mb-1">{label}</label>
                    <input type="number" min={0} value={(form as Record<string, number | string>)[field] as number}
                      onChange={e => setForm({ ...form, [field]: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={handleCreate} disabled={saving} className="btn-gold px-4 py-2 flex items-center gap-2 text-sm">
                  <Save size={14} /> {saving ? "Saving..." : "Add Item"}
                </button>
                <button onClick={() => setIsAdding(false)} className="text-sm text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {/* Items Table */}
          {loading ? (
            <div className="text-center py-16 text-[var(--warm-gray)]">Loading...</div>
          ) : (
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--dark-border)] text-[var(--warm-gray)] text-xs">
                      <th className="text-left px-4 py-3 font-semibold min-w-[140px]">Item</th>
                      <th className="text-center px-3 py-3 font-semibold min-w-[90px]">Main Store</th>
                      <th className="text-center px-3 py-3 font-semibold min-w-[90px]">Front Store</th>
                      <th className="text-right px-3 py-3 font-semibold min-w-[80px]">Cost / Sell</th>
                      <th className="text-center px-3 py-3 font-semibold min-w-[80px]">Status</th>
                      <th className="px-3 py-3 min-w-[90px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => (
                      editing?.id === item.id ? (
                        <tr key={item.id} className="bg-[var(--gold)]/5">
                          <td colSpan={6} className="p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                              <div>
                                <label className="text-xs text-[var(--warm-gray)] block mb-1">Name</label>
                                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded px-2 py-1.5 text-sm text-[var(--off-white)]" />
                              </div>
                              <div>
                                <label className="text-xs text-[var(--warm-gray)] block mb-1">Cost Price (₦)</label>
                                <input type="number" value={editing.costPrice} onChange={e => setEditing({ ...editing, costPrice: parseFloat(e.target.value) || 0 })} className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded px-2 py-1.5 text-sm text-[var(--off-white)]" />
                              </div>
                              <div>
                                <label className="text-xs text-[var(--warm-gray)] block mb-1">Selling Price (₦)</label>
                                <input type="number" value={editing.sellingPrice} onChange={e => setEditing({ ...editing, sellingPrice: parseFloat(e.target.value) || 0 })} className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded px-2 py-1.5 text-sm text-[var(--off-white)]" />
                              </div>
                              <div>
                                <label className="text-xs text-[var(--warm-gray)] block mb-1">Main Store ({item.unit})</label>
                                <input type="number" value={editing.mainStoreCount} onChange={e => setEditing({ ...editing, mainStoreCount: parseInt(e.target.value) || 0 })} className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded px-2 py-1.5 text-sm text-[var(--off-white)]" />
                              </div>
                              <div>
                                <label className="text-xs text-[var(--warm-gray)] block mb-1">Front Store ({item.unit})</label>
                                <input type="number" value={editing.frontStoreCount} onChange={e => setEditing({ ...editing, frontStoreCount: parseInt(e.target.value) || 0 })} className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded px-2 py-1.5 text-sm text-[var(--off-white)]" />
                              </div>
                              <div>
                                <label className="text-xs text-[var(--warm-gray)] block mb-1">Purchase Unit</label>
                                <CustomSelect value={editing.purchaseUnit} onChange={v => setEditing({ ...editing, purchaseUnit: v })} options={PURCHASE_UNITS.map(u => ({ value: u, label: u }))} />
                              </div>
                              <div>
                                <label className="text-xs text-[var(--warm-gray)] block mb-1">Units per {editing.purchaseUnit}</label>
                                <input type="number" value={editing.unitsPerPurchaseUnit} onChange={e => setEditing({ ...editing, unitsPerPurchaseUnit: parseInt(e.target.value) || 1 })} className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded px-2 py-1.5 text-sm text-[var(--off-white)]" />
                              </div>
                              <div>
                                <label className="text-xs text-[var(--warm-gray)] block mb-1">Low Stock Alert</label>
                                <input type="number" value={editing.lowStockAlert} onChange={e => setEditing({ ...editing, lowStockAlert: parseInt(e.target.value) || 0 })} className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded px-2 py-1.5 text-sm text-[var(--off-white)]" />
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button onClick={handleUpdate} disabled={saving} className="btn-gold px-3 py-1 text-xs flex items-center gap-1"><Save size={11} /> {saving ? "Saving..." : "Save"}</button>
                              <button onClick={() => setEditing(null)} className="text-xs text-[var(--warm-gray)] hover:text-[var(--off-white)]">Cancel</button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={item.id} className="border-b border-[var(--dark-border)]/50 hover:bg-[var(--gold)]/3 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-[var(--off-white)]">{item.name}</div>
                            <div className="text-[10px] text-[var(--warm-gray)]">{item.sku || "—"} · {item.category} · {item.purchaseUnit} ({item.unitsPerPurchaseUnit} {item.unit})</div>
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-bold text-[var(--gold)]">
                            {item.mainStoreCount} <span className="text-xs text-[var(--warm-gray)] font-normal">{item.unit}</span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`font-mono font-bold ${item.frontStoreCount <= item.lowStockAlert ? "text-red-400" : "text-green-400"}`}>
                              {item.frontStoreCount}
                            </span>
                            {item.frontStoreCount <= item.lowStockAlert && <AlertTriangle size={10} className="inline ml-1 text-red-400" />}
                            <div className="text-xs text-[var(--warm-gray)]">{item.unit}</div>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <p className="text-[var(--off-white)] font-mono text-sm">₦{item.sellingPrice.toLocaleString()}</p>
                            <p className="text-emerald-400 font-mono text-xs">+₦{(item.sellingPrice - item.costPrice).toLocaleString()}</p>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.available ? "text-green-400 bg-green-400/10 border-green-400/30" : "text-zinc-500 bg-zinc-500/10 border-zinc-500/30"}`}>
                              {item.available ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-1 justify-end">
                              <button onClick={() => setEditing(item)} className="w-7 h-7 flex items-center justify-center rounded text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all">
                                <Edit2 size={13} />
                              </button>
                              <button onClick={() => setConfirmDelete(item)} className="w-7 h-7 flex items-center justify-center rounded text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-400/10 transition-all">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    ))}
                    {filteredItems.length === 0 && (
                      <tr><td colSpan={6} className="py-12 text-center text-[var(--warm-gray)]">No items yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Transfer Tab (POS-Style Cart) ── */}
      {activeTab === "transfer" && (
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 lg:h-[calc(100vh-340px)]">

          {/* LEFT: Item Grid */}
          <div className="lg:col-span-3 flex flex-col overflow-hidden h-[450px] lg:h-auto">
            {/* Scrollable Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-0 rounded-xl border border-[var(--dark-border)] bg-[var(--dark-card)]">
              {transferGridItems.length === 0 ? (
                <div className="text-center py-12 text-[var(--warm-gray)]">No items match your search.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-0.5 p-1">
                  {transferGridItems.map(item => {
                    const inCart = cart.find(c => c.itemId === item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => addToCart(item)}
                        className={`relative p-3 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]
                          ${inCart ? "bg-[var(--gold)]/15 border border-[var(--gold)]/50" : "bg-[var(--black)] border border-[var(--dark-border)] hover:border-[var(--gold)]/30"}`}
                      >
                        {inCart && (
                          <span className="absolute top-2 right-2 w-5 h-5 bg-[var(--gold)] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                            {inCart.qty}
                          </span>
                        )}
                        <p className="font-semibold text-sm text-[var(--off-white)] pr-6 leading-tight mb-1">{item.name}</p>
                        <p className="text-[10px] text-[var(--warm-gray)]">{item.category}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold ${item.mainStoreCount <= 0 ? "text-red-400" : "text-[var(--gold)]"}`}>
                            Main: {item.mainStoreCount} {item.unit}
                          </span>
                        </div>
                        <div className={`text-[10px] font-mono ${item.frontStoreCount <= item.lowStockAlert ? "text-red-400" : "text-[var(--warm-gray)]"}`}>
                          Front: {item.frontStoreCount} {item.unit}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Cart */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Global Direction */}
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[var(--off-white)] flex items-center gap-2">
                <ArrowRightLeft size={14} className="text-[var(--gold)]" /> Transfer Action
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {DIRECTIONS.map(d => (
                  <button key={d.value} onClick={() => setGlobalDir(d.value as typeof globalDir)}
                    className={`px-2 py-2 text-[11px] font-semibold rounded-lg border text-center transition-all
                      ${globalDir === d.value ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/30"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs text-[var(--warm-gray)] mb-1 block">Note (applies to all items)</label>
                <input value={globalNote} onChange={e => setGlobalNote(e.target.value)}
                  placeholder="e.g. Evening restock for VIP bar..."
                  className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-xs text-[var(--off-white)] outline-none focus:border-[var(--gold)]/50" />
              </div>

              {/* Location picker — only shown for location_transfer */}
              {globalDir === "location_transfer" && (
                <div>
                  <label className="text-xs text-[var(--warm-gray)] mb-1 block flex items-center gap-1">
                    <MapPin size={10} className="text-[var(--gold)]" /> Target Location *
                  </label>
                  {locationsLoading ? (
                    <p className="text-xs text-[var(--warm-gray)]]">Loading locations...</p>
                  ) : locations.length === 0 ? (
                    <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                      No locations set up yet. Ask admin to add VIP, Rooftop, Bar etc. via the Locations API.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      {locations.filter(l => l.isActive).map(loc => (
                        <button key={loc.id} onClick={() => setGlobalLocation(loc.id)}
                          className={`px-2 py-2 text-[11px] font-semibold rounded-lg border text-center transition-all
                            ${globalLocation === loc.id ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/30"}`}>
                          {loc.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {globalDir === "location_transfer" && !globalLocation && (
                    <p className="text-[10px] text-amber-400 mt-1">⚠ Select a location to enable transfer</p>
                  )}
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-[var(--dark-border)] flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--off-white)] flex items-center gap-2">
                  <ShoppingCart size={14} className="text-[var(--gold)]" />
                  Cart {cart.length > 0 && <span className="text-[var(--warm-gray)] font-normal">({cart.length} items)</span>}
                </span>
                {cart.length > 0 && (
                  <button onClick={() => setCart([])} className="text-xs text-red-400 hover:text-red-300">Clear All</button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-[var(--warm-gray)] text-sm px-4">
                    <ShoppingCart size={32} className="mx-auto mb-3 opacity-20" />
                    Click items on the left to add them to your transfer
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--dark-border)]">
                    {cart.map(cartItem => {
                      const item = items.find(i => i.id === cartItem.itemId);
                      if (!item) return null;
                      const unitLabel = (globalDir === "receive" || globalDir === "store_to_front") && item.unitsPerPurchaseUnit > 1
                        ? item.purchaseUnit : item.unit;
                      const bottleEq = (globalDir === "receive" || globalDir === "store_to_front") && item.unitsPerPurchaseUnit > 1
                        ? cartItem.qty * item.unitsPerPurchaseUnit : null;
                      return (
                        <div key={cartItem.id} className="px-4 py-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-sm font-semibold text-[var(--off-white)]">{item.name}</p>
                              <p className="text-[10px] text-[var(--warm-gray)]">{item.category}</p>
                            </div>
                            <button onClick={() => updateCartQty(item.id, 0)} className="text-[var(--warm-gray)] hover:text-red-400 transition-colors mt-0.5">
                              <X size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCartQty(item.id, cartItem.qty - 1)}
                              className="w-7 h-7 rounded-lg bg-[var(--black)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--off-white)] hover:border-[var(--gold)]/40 transition-all">
                              <Minus size={12} />
                            </button>
                            <input type="number" min={1} value={cartItem.qty}
                              onChange={e => updateCartQty(item.id, parseInt(e.target.value) || 1)}
                              className="w-14 text-center bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-2 py-1 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]/50" />
                            <button onClick={() => updateCartQty(item.id, cartItem.qty + 1)}
                              className="w-7 h-7 rounded-lg bg-[var(--black)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--off-white)] hover:border-[var(--gold)]/40 transition-all">
                              <Plus size={12} />
                            </button>
                            <span className="text-xs text-[var(--warm-gray)]">{unitLabel}</span>
                            {bottleEq && <span className="text-[10px] text-[var(--gold)] ml-auto">= {bottleEq} {item.unit}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Confirm Button */}
              <div className="p-4 border-t border-[var(--dark-border)]">
                <button
                  onClick={handleTransfer}
                  disabled={saving || cart.length === 0 || (globalDir === "location_transfer" && !globalLocation)}
                  className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
                    ${transferSuccess ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                      (cart.length === 0 || (globalDir === "location_transfer" && !globalLocation)) ? "bg-[var(--dark-border)] text-[var(--warm-gray)] cursor-not-allowed" : "btn-gold"}`}
                >
                  {transferSuccess ? <><Check size={16} /> Done!</> :
                    saving ? "Processing..." :
                    <><ArrowRightLeft size={16} /> Confirm {cart.length} Transfer(s)</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Log Tab ── */}
      {activeTab === "log" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-[var(--gold)]" />
                <span className="text-sm font-semibold text-[var(--off-white)]">Filter Log</span>
                <span className="text-xs text-[var(--warm-gray)]">({transfers.length} entries)</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => fetchTransfers(logFrom, logTo, logDirFilter)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-all">
                  <RefreshCw size={12} /> Refresh
                </button>
                <button onClick={() => setShowResetModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all">
                  <RotateCcw size={12} /> Reset Log
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <p className="text-xs text-[var(--warm-gray)] mb-2 font-semibold uppercase tracking-wider">Date Range</p>
              <DateRangeFilter from={logFrom} to={logTo} onChange={(f, t) => { setLogFrom(f); setLogTo(t); }} />
            </div>

            {/* Direction Filter */}
            <div>
              <p className="text-xs text-[var(--warm-gray)] mb-2 font-semibold uppercase tracking-wider">Action Type</p>
              <div className="flex gap-2 flex-wrap">
                {[{ value: "all", label: "All Actions" }, ...DIRECTIONS].map(d => (
                  <button key={d.value} onClick={() => setLogDirFilter(d.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all
                      ${logDirFilter === d.value ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/30"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter — only meaningful when direction includes location_transfer */}
            {locations.length > 0 && (
              <div>
                <p className="text-xs text-[var(--warm-gray)] mb-2 font-semibold uppercase tracking-wider">Filter by Location</p>
                <div className="flex gap-2 flex-wrap">
                  {[{ id: "all", name: "All Locations" }, ...locations].map(loc => (
                    <button key={loc.id} onClick={() => setLogLocationFilter(loc.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1
                        ${logLocationFilter === loc.id ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/30"}`}>
                      {loc.id !== "all" && <MapPin size={10} />}
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Log Table */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--dark-border)] text-[var(--warm-gray)] text-xs">
                    <th className="text-left px-4 py-3 font-semibold">Item</th>
                    <th className="text-left px-3 py-3 font-semibold">Action</th>
                    <th className="text-center px-3 py-3 font-semibold">Qty</th>
                    <th className="text-left px-3 py-3 font-semibold">Note</th>
                    <th className="text-left px-3 py-3 font-semibold">By</th>
                    <th className="text-left px-3 py-3 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logLoading ? (
                    <tr><td colSpan={6} className="py-10 text-center text-[var(--warm-gray)]">Loading...</td></tr>
                  ) : transfers.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-[var(--warm-gray)]">No records found for the selected filters.</td></tr>
                  ) : transfers.map(t => (
                    <tr key={t.id} className="border-b border-[var(--dark-border)]/50 hover:bg-[var(--gold)]/3">
                      <td className="px-4 py-3 font-medium text-[var(--off-white)]">
                        {t.item.name}
                        <div className="text-[10px] text-[var(--warm-gray)]">{t.item.category}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border w-fit ${DIR_COLORS[t.direction] || "text-[var(--warm-gray)] border-[var(--dark-border)]"}`}>
                            {DIR_LABEL[t.direction] || t.direction}
                          </span>
                          {t.toLocationId && getLocationName(t.toLocationId) && (
                            <span className="text-[10px] text-[var(--gold)] flex items-center gap-1">
                              <MapPin size={9} /> {getLocationName(t.toLocationId)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-[var(--gold)]">
                        {t.quantity} <span className="text-[10px] text-[var(--warm-gray)] font-normal">{t.item.unit}</span>
                      </td>
                      <td className="px-3 py-3 text-xs text-[var(--warm-gray)] max-w-[180px] truncate">{t.note || "—"}</td>
                      <td className="px-3 py-3 text-xs text-[var(--warm-gray)]">{t.transferredBy.name || t.transferredBy.email}</td>
                      <td className="px-3 py-3 text-xs text-[var(--warm-gray)]">
                        {new Date(t.createdAt).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Locations Tab ── */}
      {activeTab === "locations" && (
        <div className="space-y-6">
          {/* Add Location Form */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--off-white)] flex items-center gap-2">
              <MapPin size={14} className="text-[var(--gold)]" /> Add New Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[var(--warm-gray)] mb-1">Location Name *</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Lounge, Rooftop Bar"
                  value={newLocationName}
                  onChange={e => setNewLocationName(e.target.value)}
                  className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--warm-gray)] mb-1">Description (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Exclusive VIP area with premium pricing"
                  value={newLocationDesc}
                  onChange={e => setNewLocationDesc(e.target.value)}
                  className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)] transition-colors"
                />
              </div>
            </div>
            <button
              disabled={!newLocationName.trim() || addingLocation}
              onClick={async () => {
                setAddingLocation(true);
                try {
                  const res = await fetch("/api/inventory/locations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newLocationName.trim(), description: newLocationDesc.trim() || null }),
                  });
                  if (res.ok) {
                    setNewLocationName("");
                    setNewLocationDesc("");
                    await fetchLocations();
                    setSuccessMessage("Location added successfully!");
                    setTimeout(() => setSuccessMessage(null), 3000);
                  } else {
                    const e = await res.json();
                    setAlertMessage(e.error || "Failed to create location.");
                  }
                } catch {
                  setAlertMessage("Network error creating location.");
                }
                setAddingLocation(false);
              }}
              className="btn-gold px-4 py-2 flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={14} /> {addingLocation ? "Adding..." : "Add Location"}
            </button>
          </div>

          {/* Locations List */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--dark-border)]">
              <h3 className="text-sm font-bold text-[var(--off-white)]">Store Locations ({locations.length})</h3>
            </div>
            {locationsLoading ? (
              <div className="text-center py-12 text-[var(--warm-gray)]">Loading...</div>
            ) : locations.length === 0 ? (
              <div className="text-center py-12 text-[var(--warm-gray)] text-sm">
                <MapPin size={32} className="mx-auto mb-3 opacity-20" />
                No locations yet. Add your first one above.
              </div>
            ) : (
              <div className="divide-y divide-[var(--dark-border)]">
                {locations.map(loc => (
                  <div key={loc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--gold)]/3 transition-colors">
                    
                    {editingLocation?.id === loc.id ? (
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="text" value={editingLocation.name} onChange={e => setEditingLocation({ ...editingLocation, name: e.target.value })}
                            className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]" />
                          <input type="text" value={editingLocation.description || ""} onChange={e => setEditingLocation({ ...editingLocation, description: e.target.value })} placeholder="Description"
                            className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]" />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--warm-gray)] hover:text-[var(--off-white)]">
                            <input type="checkbox" checked={editingLocation.isActive} onChange={e => setEditingLocation({ ...editingLocation, isActive: e.target.checked })}
                              className="w-4 h-4 rounded border-[var(--dark-border)] bg-[var(--black)] checked:bg-[var(--gold)] checked:border-[var(--gold)] focus:ring-[var(--gold)] focus:ring-offset-0 transition-all cursor-pointer" />
                            Active Location
                          </label>
                          <div className="flex items-center gap-2 ml-auto">
                            <button onClick={() => setEditingLocation(null)} className="text-xs font-semibold text-[var(--warm-gray)] hover:text-[var(--off-white)]">Cancel</button>
                            <button onClick={handleUpdateLocation} className="btn-gold px-3 py-1.5 text-xs">Save</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${loc.isActive ? "bg-[var(--gold)]/15" : "bg-zinc-500/15"}`}>
                            <MapPin size={14} className={loc.isActive ? "text-[var(--gold)]" : "text-zinc-500"} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--off-white)]">{loc.name}</p>
                            {loc.description && <p className="text-xs text-[var(--warm-gray)]">{loc.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${loc.isActive ? "text-green-400 bg-green-400/10 border-green-400/30" : "text-zinc-500 bg-zinc-500/10 border-zinc-500/30"}`}>
                            {loc.isActive ? "Active" : "Inactive"}
                          </span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingLocation(loc)} className="p-1.5 text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-md transition-colors" title="Edit Location">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => setConfirmDeleteLocation(loc)} className="p-1.5 text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Delete Location">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Item?"
          message={<>Remove <strong className="text-[var(--off-white)]">{confirmDelete?.name}</strong> from inventory? This cannot be undone.</>}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {confirmDeleteLocation && (
        <ConfirmModal
          title="Delete Location?"
          message={<>Delete <strong className="text-[var(--off-white)]">{confirmDeleteLocation.name}</strong>? This cannot be undone.</>}
          onConfirm={handleDeleteLocation}
          onCancel={() => setConfirmDeleteLocation(null)}
        />
      )}

      {showResetModal && (
        <ResetPasswordModal
          staffEmail={staffEmail || ""}
          onConfirm={handleResetLog}
          onCancel={() => setShowResetModal(false)}
        />
      )}

      {alertMessage && (
        <AlertModal title="Error" message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}

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
