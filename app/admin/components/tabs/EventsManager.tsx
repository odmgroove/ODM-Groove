"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Save, X, Calendar, Star, Copy, CheckCircle, ExternalLink } from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";
import CustomSelect from "../../../components/CustomSelect";

type Event = {
  id: string;
  title: string;
  subtitle?: string | null;
  description: string;
  date: string;
  endTime: string;
  venue: string;
  category: string;
  status: string;
  featured: boolean;
  ticketPrices: string;
  contactNumbers: string;
  hashtags: string;
  whatsappNumber: string;
  image?: string | null;
  accentColor: string;
  artists?: string | null;
  ageLimit?: number | null;
  extras?: string | null;
};

const EMPTY_FORM = {
  title: "", subtitle: "", description: "", date: "", endTime: "Till Dawn",
  venue: "", category: "pool-party", status: "upcoming", featured: false,
  ticketPrices: '[{"label":"Guys","price":5000},{"label":"Girls","price":3000}]',
  contactNumbers: "", hashtags: "", whatsappNumber: "", image: "",
  accentColor: "#c8a84b", artists: "", ageLimit: 18, extras: "",
};

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Event | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchEvents = async () => {
    const res = await fetch("/api/events?status=all");
    if (res.ok) setEvents(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (ev: Event) => {
    setEditId(ev.id);
    setForm({
      title: ev.title,
      subtitle: ev.subtitle || "",
      description: ev.description,
      date: new Date(ev.date).toISOString().slice(0, 16),
      endTime: ev.endTime,
      venue: ev.venue,
      category: ev.category,
      status: ev.status,
      featured: ev.featured,
      ticketPrices: ev.ticketPrices,
      contactNumbers: ev.contactNumbers,
      hashtags: ev.hashtags,
      whatsappNumber: ev.whatsappNumber,
      image: ev.image || "",
      accentColor: ev.accentColor,
      artists: ev.artists || "",
      ageLimit: ev.ageLimit ?? 18,
      extras: ev.extras || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.date) return;
    setSaving(true);
    const payload = {
      ...form,
      date: new Date(form.date).toISOString(),
      featured: Boolean(form.featured),
      ageLimit: form.ageLimit ? Number(form.ageLimit) : null,
      subtitle: form.subtitle || null,
      image: form.image || null,
      artists: form.artists || null,
      extras: form.extras || null,
    };

    try {
      let res;
      if (editId) {
        res = await fetch(`/api/events/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        await fetchEvents();
        setSuccessMessage("Event saved successfully!");
        setShowForm(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error saving event: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An unexpected error occurred.");
    }
    
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const ev = events.find(e => e.id === id);
    if (ev) setConfirmDelete(ev);
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/events/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== confirmDelete.id));
        setSuccessMessage("Event deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error deleting event: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while deleting.");
    }
    setConfirmDelete(null);
  };

  const copyWhatsApp = async (ev: Event) => {
    const prices = (() => { try { return JSON.parse(ev.ticketPrices); } catch { return []; } })();
    const msg = `🎉 *${ev.title}${ev.subtitle ? ` — ${ev.subtitle}` : ""}!*\n\n` +
      `📅 ${new Date(ev.date).toDateString()}\n⏰ 5PM ${ev.endTime}\n📍 ${ev.venue}\n\n` +
      `🎟 *TICKETS:*\n${prices.map((t: any) => `   • ${t.label}: ₦${t.price?.toLocaleString()}`).join("\n")}\n\n` +
      `📲 Reserve now:\n${ev.contactNumbers}\n\n${ev.hashtags}`;
    await navigator.clipboard.writeText(msg);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const upcoming = events.filter(e => e.status === "upcoming" || e.status === "live");
  const past = events.filter(e => e.status === "past");

  const renderEventCard = (ev: Event) => (
    <div key={ev.id} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden" style={{ borderTop: `3px solid ${ev.accentColor}` }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                ev.status === "live" ? "bg-green-500/15 text-green-400 border border-green-500/30"
                : ev.status === "past" ? "bg-[var(--dark-border)] text-[var(--warm-gray)]"
                : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
              }`}>{ev.status === "live" ? "🔴 Live" : ev.status === "past" ? "Past" : "✓ Upcoming"}</span>
              {ev.featured && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">★ Featured</span>}
            </div>
            <h3 className="font-bold text-[var(--off-white)] text-lg">{ev.title}</h3>
            {ev.subtitle && <p className="text-sm font-medium" style={{ color: ev.accentColor }}>{ev.subtitle}</p>}
            <p className="text-xs text-[var(--warm-gray)] mt-1 flex items-center gap-1.5">
              <Calendar size={11} /> {new Date(ev.date).toDateString()} · {ev.venue.substring(0, 50)}...
            </p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all">
              <Pencil size={15} />
            </button>
            <button onClick={() => handleDelete(ev.id)} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-500/10 transition-all">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => copyWhatsApp(ev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${copiedId === ev.id ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-[var(--dark)] border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--off-white)]"}`}>
            {copiedId === ev.id ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> WhatsApp Blast</>}
          </button>
          <a href={`/events/${ev.id}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[var(--dark)] border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--gold)] transition-all">
            <ExternalLink size={12} /> View Page
          </a>
          <button onClick={() => {
            const wa = `https://wa.me/?text=${encodeURIComponent(
              `🎉 *${ev.title}* is happening!\n📅 ${new Date(ev.date).toDateString()}\n📍 ${ev.venue}\n\nFor details, visit:\nhttps://odmgroove.vercel.app/events/${ev.id}`
            )}`;
            window.open(wa, "_blank");
          }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-500/15 border border-green-500/25 text-green-400 hover:bg-green-500/25 transition-all">
            Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="sticky top-0 z-20 bg-[var(--black)]/95 backdrop-blur-md pb-4 pt-6 -mx-6 px-6 -mt-6 mb-6 border-b border-[var(--dark-border)] flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--off-white)]">Events</h2>
          <p className="text-sm text-[var(--warm-gray)]">{upcoming.length} upcoming · {past.length} past</p>
        </div>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2 !px-4 !py-2.5 !text-xs">
          <Plus size={14} /> Add Event
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[var(--dark-card)] border border-[var(--gold)]/30 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-[var(--off-white)] mb-4">{editId ? "Edit Event" : "New Event"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" placeholder="Event title" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Subtitle</label>
              <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" placeholder="e.g. Water Splash Pool Party" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Date & Time *</label>
              <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Status</label>
              <CustomSelect 
                value={form.status} 
                onChange={val => setForm({ ...form, status: val })}
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "live", label: "Live" },
                  { value: "past", label: "Past" }
                ]}
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Accent Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-[var(--dark-border)] bg-transparent cursor-pointer" />
                <input value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })}
                  className="flex-1 bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Venue</label>
              <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" placeholder="Full venue address" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50 resize-none" placeholder="Short event description" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Contact Numbers (comma-separated)</label>
              <input value={form.contactNumbers} onChange={e => setForm({ ...form, contactNumbers: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" placeholder="07061514120,09049180725" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">WhatsApp Number (intl)</label>
              <input value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" placeholder="2347061514120" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Artists (comma-separated)</label>
              <input value={form.artists} onChange={e => setForm({ ...form, artists: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" placeholder="VDJ Tiko,ODM Groove" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Age Limit</label>
              <input type="number" value={form.ageLimit ?? 18} onChange={e => setForm({ ...form, ageLimit: +e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Ticket Prices (JSON)</label>
              <input value={form.ticketPrices} onChange={e => setForm({ ...form, ticketPrices: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] font-mono focus:outline-none focus:border-[var(--gold)]/50" placeholder='[{"label":"Guys","price":5000}]' />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Hashtags (comma-separated)</label>
              <input value={form.hashtags} onChange={e => setForm({ ...form, hashtags: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" placeholder="#ODMGroove,#PoolParty" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Image URL</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" placeholder="/events/my-event.jpg" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Extras (comma-separated)</label>
              <input value={form.extras} onChange={e => setForm({ ...form, extras: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50" placeholder="Water guns,Maximum security,Free parking" />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm({ ...form, featured: !form.featured })}
                className={`flex items-center gap-2 text-sm font-medium ${form.featured ? "text-[var(--gold)]" : "text-[var(--warm-gray)]"}`}>
                <Star size={18} className={form.featured ? "fill-[var(--gold)] text-[var(--gold)]" : ""} />
                {form.featured ? "Featured" : "Not Featured"}
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-gold flex items-center gap-2 !px-4 !py-2 !text-xs">
              <Save size={13} /> {saving ? "Saving..." : "Save Event"}
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--off-white)]">
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? <p className="text-[var(--warm-gray)]">Loading...</p> : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--gold)] mb-4">Active / Upcoming ({upcoming.length})</h3>
              <div className="space-y-4">{upcoming.map(renderEventCard)}</div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--warm-gray)] mb-4">Past Events ({past.length})</h3>
              <div className="space-y-4 opacity-60">{past.map(renderEventCard)}</div>
            </div>
          )}
          {events.length === 0 && (
            <div className="text-center py-16 text-[var(--warm-gray)]">
              <Calendar size={40} className="mx-auto mb-4 opacity-30" />
              <p>No events yet. Add your first event above.</p>
            </div>
          )}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Event?"
          message={<>Remove <strong className="text-[var(--off-white)]">{confirmDelete.title}</strong> permanently? This cannot be undone.</>}
          onConfirm={confirmAndDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {alertMessage && (
        <AlertModal
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
