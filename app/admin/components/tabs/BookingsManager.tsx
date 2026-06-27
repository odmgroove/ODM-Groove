"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, Trash2, Phone, Calendar, AlertTriangle, X, ChevronDown } from "lucide-react";
import AlertModal from "../AlertModal";

type Booking = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  eventDate: string | null;
  type: string;
  guests: number | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({
  booking,
  onConfirm,
  onCancel,
}: {
  booking: Booking;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-400" />
        <div className="p-6">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--dark-card)] text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex flex-col items-center gap-4 text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--off-white)] mb-1">Delete Reservation?</h2>
              <p className="text-sm text-[var(--warm-gray)]">
                This will permanently remove the booking for <span className="text-[var(--off-white)] font-semibold">{booking.name}</span>. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Booking summary */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--warm-gray)]">Ref ID</span>
              <span className="font-mono text-[var(--gold)] text-xs">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--warm-gray)]">Type</span>
              <span className="text-[var(--off-white)] capitalize">{booking.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--warm-gray)]">Phone</span>
              <span className="text-[var(--off-white)]">{booking.phone}</span>
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
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<Booking | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) setBookings(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const oldBookings = [...bookings];
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSuccessMessage("Booking status updated.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setBookings(oldBookings);
        setAlertMessage(`Error updating status: ${await res.text()}`);
      }
    } catch (e) {
      setBookings(oldBookings);
      setAlertMessage("An error occurred while updating status.");
    }
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const oldBookings = [...bookings];
    setBookings(prev => prev.filter(b => b.id !== confirmDelete.id));
    try {
      const res = await fetch(`/api/bookings/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccessMessage("Booking deleted.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setBookings(oldBookings);
        setAlertMessage(`Error deleting booking: ${await res.text()}`);
      }
    } catch (e) {
      setBookings(oldBookings);
      setAlertMessage("An error occurred while deleting.");
    }
    setConfirmDelete(null);
  };

  if (loading) return <div className="p-6 text-[var(--warm-gray)]">Loading bookings...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="sticky top-0 z-20 bg-[var(--black)]/95 backdrop-blur-md pb-4 pt-6 -mx-6 px-6 -mt-6 mb-6 border-b border-[var(--dark-border)] flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--off-white)]">Reservations & Enquiries</h2>
          <p className="text-sm text-[var(--warm-gray)]">Track all room bookings and event hall enquiries</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 text-[var(--warm-gray)] bg-[var(--dark-card)] rounded-xl border border-[var(--dark-border)]">
          <Calendar size={40} className="mx-auto mb-4 opacity-30" />
          <p>No reservations found yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--dark-border)] bg-[var(--dark-card)]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--dark)] text-[var(--warm-gray)] uppercase text-[10px] tracking-wider border-b border-[var(--dark-border)]">
              <tr>
                <th className="px-4 py-4">Ref ID / Date</th>
                <th className="px-4 py-4">Client</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Details</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dark-border)]">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[var(--dark)]/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-mono text-xs text-[var(--gold)] mb-1">{b.id}</div>
                    <div className="text-xs text-[var(--warm-gray)]">{new Date(b.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-[var(--off-white)]">{b.name}</div>
                    <div className="text-xs text-[var(--warm-gray)] flex items-center gap-1 mt-1">
                      <Phone size={10} /> {b.phone}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      b.type === "room" ? "bg-blue-500/15 text-blue-400" : "bg-purple-500/15 text-purple-400"
                    }`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 max-w-[200px]">
                    <div className="text-xs text-[var(--warm-gray)] line-clamp-2" title={b.notes || ""}>
                      {b.notes || "-"}
                    </div>
                    {b.eventDate && (
                      <div className="text-[10px] text-[var(--gold)] mt-1">
                        Date: {new Date(b.eventDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`flex items-center gap-1.5 px-2 py-1 w-fit rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      b.status === "confirmed" ? "bg-emerald-500/15 text-emerald-400" : 
                      b.status === "cancelled" ? "bg-red-500/15 text-red-400" : 
                      "bg-yellow-500/15 text-yellow-400"
                    }`}>
                      {b.status === "confirmed" ? <CheckCircle size={12} /> : b.status === "pending" ? <Clock size={12} /> : null}
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <div className="relative">
                        <select 
                          value={b.status} 
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className="appearance-none bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg pl-3 pr-8 py-1.5 text-xs text-[var(--off-white)] outline-none focus:border-[var(--gold)] cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] pointer-events-none" />
                      </div>
                      <button 
                        onClick={() => setConfirmDelete(b)}
                        className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete reservation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <ConfirmDeleteModal
          booking={confirmDelete}
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
