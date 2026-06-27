"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight } from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";

type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  features: string;
  image?: string | null;
  available: boolean;
};

const EMPTY_FORM = {
  name: "", description: "", price: 0, capacity: 2, features: "", image: "", available: true,
};

export default function RoomsManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Room | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchRooms = async () => {
    const res = await fetch("/api/rooms");
    if (res.ok) setRooms(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (room: Room) => {
    setEditId(room.id);
    setForm({
      name: room.name,
      description: room.description,
      price: room.price,
      capacity: room.capacity,
      features: room.features,
      image: room.image || "",
      available: room.available,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { ...form, price: Number(form.price), capacity: Number(form.capacity) };

    try {
      const res = await fetch(editId ? `/api/rooms/${editId}` : "/api/rooms", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        await fetchRooms();
        setSuccessMessage("Room saved successfully!");
        setShowForm(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An unexpected error occurred.");
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const room = rooms.find(r => r.id === id);
    if (room) setConfirmDelete(room);
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/rooms/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setRooms(prev => prev.filter(r => r.id !== confirmDelete.id));
        setSuccessMessage("Room deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error deleting room: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while deleting.");
    }
    setConfirmDelete(null);
  };

  const toggleAvailable = async (room: Room) => {
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !room.available }),
      });
      if (res.ok) {
        setRooms(prev => prev.map(r => r.id === room.id ? { ...r, available: !r.available } : r));
        setSuccessMessage(`Room marked as ${!room.available ? 'available' : 'unavailable'}.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error updating status: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("Failed to update status.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="sticky top-0 z-20 bg-[var(--black)]/95 backdrop-blur-md pb-4 pt-6 -mx-6 px-6 -mt-6 mb-6 border-b border-[var(--dark-border)] flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--off-white)]">Rooms</h2>
          <p className="text-sm text-[var(--warm-gray)]">{rooms.length} rooms</p>
        </div>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2 !px-4 !py-2.5 !text-xs">
          <Plus size={14} /> Add Room
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--dark-card)] border border-[var(--gold)]/30 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-[var(--off-white)] mb-4">{editId ? "Edit Room" : "New Room"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Room Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="e.g. Deluxe Suite" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Price (₦/night)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Capacity (persons)</label>
              <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: +e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Image URL (optional)</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="/rooms/deluxe.jpg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50 resize-none"
                placeholder="Short room description" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Features (comma-separated)</label>
              <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="King-size Bed,Free Breakfast,WiFi,Pool Access" />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm({ ...form, available: !form.available })} className={`flex items-center gap-2 text-sm font-medium ${form.available ? "text-emerald-400" : "text-[var(--warm-gray)]"}`}>
                {form.available ? <ToggleRight size={22} className="text-emerald-400" /> : <ToggleLeft size={22} />}
                {form.available ? "Available" : "Unavailable"}
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-gold flex items-center gap-2 !px-4 !py-2 !text-xs">
              <Save size={13} /> {saving ? "Saving..." : "Save Room"}
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--off-white)]">
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? <p className="text-[var(--warm-gray)]">Loading...</p> : (
        <div className="grid gap-4">
          {rooms.map(room => (
            <div key={room.id} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-[var(--off-white)]">{room.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${room.available ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                      {room.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--warm-gray)] mb-2">{room.description}</p>
                  <div className="flex gap-4 text-xs text-[var(--warm-gray)]">
                    <span className="text-[var(--gold)] font-bold">₦{room.price.toLocaleString()}/night</span>
                    <span>👥 {room.capacity} guests</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleAvailable(room)} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all" title="Toggle availability">
                    {room.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={() => openEdit(room)} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--dark-border)]">
                {room.features.split(",").map((f, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-[var(--dark)] border border-[var(--dark-border)] text-[var(--warm-gray)]">{f.trim()}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Room?"
          message={`Are you sure you want to delete ${confirmDelete.name}?`}
          onConfirm={confirmAndDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

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
