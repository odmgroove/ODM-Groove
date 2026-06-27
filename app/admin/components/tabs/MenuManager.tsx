"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight, Search } from "lucide-react";
import CustomSelect from "../../../components/CustomSelect";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";

type MenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  subcategory?: string | null;
  emoji?: string | null;
  tag?: string | null;
  available: boolean;
  order: number;
};

const CATEGORIES = ["food", "beers", "spirits", "wines", "shots", "softdrinks", "shisha", "swimming", "snooker", "club", "vip"];
const TAGS = ["", "popular", "new", "vip"];

const EMPTY_FORM = {
  name: "", description: "", price: 0, category: "food", subcategory: "", emoji: "", tag: "", available: true, order: 0,
};

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<MenuItem | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/menu");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      subcategory: item.subcategory || "",
      emoji: item.emoji || "",
      tag: item.tag || "",
      available: item.available,
      order: item.order,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      order: Number(form.order),
      description: form.description || null,
      subcategory: form.subcategory || null,
      emoji: form.emoji || null,
      tag: form.tag || null,
    };

    try {
      const res = await fetch(editId ? `/api/menu/${editId}` : "/api/menu", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchItems();
        setSuccessMessage("Menu item saved successfully!");
        setShowForm(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error saving menu item: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An unexpected error occurred.");
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) setConfirmDelete(item);
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/menu/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== confirmDelete.id));
        setSuccessMessage("Menu item deleted.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error deleting menu item: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while deleting.");
    }
    setConfirmDelete(null);
  };

  const toggleAvailable = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !item.available }),
      });
      if (res.ok) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !item.available } : i));
        setSuccessMessage(`Item marked as ${!item.available ? 'available' : 'unavailable'}.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error updating status: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("Failed to update status.");
    }
  };

  const filtered = items.filter(item => {
    const matchCat = filterCategory === "all" || item.category === filterCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = filtered.reduce((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ── Unified Sticky Header Area ── */}
      <div className="sticky top-0 z-20 bg-[var(--black)]/95 backdrop-blur-md pb-2 pt-6 -mx-6 px-6 -mt-6 mb-6 border-b border-[var(--dark-border)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--off-white)]">Menu</h2>
            <p className="text-sm text-[var(--warm-gray)]">{items.length} items</p>
          </div>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2 !px-4 !py-2.5 !text-xs">
            <Plus size={14} /> Add Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pb-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-9 pr-4 py-2.5 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-lg text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
            />
          </div>
          <div className="w-full sm:w-48 shrink-0">
            <CustomSelect
              value={filterCategory}
              onChange={setFilterCategory}
              options={[
                { value: "all", label: "All Categories" },
                ...CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
              ]}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-[var(--dark-card)] border border-[var(--gold)]/30 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-[var(--off-white)] mb-4">{editId ? "Edit Item" : "New Menu Item"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="Item name" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Price (₦)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Category</label>
              <CustomSelect 
                value={form.category} 
                onChange={val => setForm({ ...form, category: val })}
                options={CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Subcategory</label>
              <input value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="e.g. Breakfast, Champagne" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Emoji</label>
              <input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="🍺" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Tag</label>
              <CustomSelect 
                value={form.tag} 
                onChange={val => setForm({ ...form, tag: val })}
                options={TAGS.map(t => ({ value: t, label: t ? (t.charAt(0).toUpperCase() + t.slice(1)) : "None" }))}
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Sort Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" />
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="Optional description" />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm({ ...form, available: !form.available })}
                className={`flex items-center gap-2 text-sm font-medium ${form.available ? "text-emerald-400" : "text-[var(--warm-gray)]"}`}>
                {form.available ? <ToggleRight size={22} className="text-emerald-400" /> : <ToggleLeft size={22} />}
                {form.available ? "Available" : "Unavailable"}
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-gold flex items-center gap-2 !px-4 !py-2 !text-xs">
              <Save size={13} /> {saving ? "Saving..." : "Save Item"}
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--off-white)]">
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? <p className="text-[var(--warm-gray)]">Loading...</p> : (
        <div className="space-y-6">
          {Object.keys(grouped).sort().map(category => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--gold)] mb-3 capitalize">{category} ({grouped[category].length})</h3>
              <div className="space-y-2">
                {grouped[category].sort((a, b) => a.order - b.order).map(item => (
                  <div key={item.id} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-lg p-4 flex items-center gap-4">
                    <span className="text-xl w-8 text-center shrink-0">{item.emoji || "🍽"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-[var(--off-white)] text-sm">{item.name}</p>
                        {item.tag && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">{item.tag}</span>}
                        {!item.available && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">Off</span>}
                      </div>
                      <p className="text-[var(--gold)] text-sm font-bold">₦{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => toggleAvailable(item)} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all" title="Toggle availability">
                        {item.available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Item?"
          message={<>Remove <strong className="text-[var(--off-white)]">{confirmDelete.name}</strong> permanently? This cannot be undone.</>}
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
