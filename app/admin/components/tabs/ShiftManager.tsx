"use client";

import { useState, useEffect } from "react";
import { Play, Square, History, DollarSign, CreditCard, Banknote, Clock, Calculator } from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";

type Shift = {
  id: string;
  staffId: string;
  staffName: string | null;
  department: string | null;
  startTime: string;
  endTime: string | null;
  cashTotal: number;
  posTotal: number;
  transferTotal: number;
  createdAt: string;
  orders: { id: string; totalRevenue: number; totalCost: number; payment: string; status: string }[];
};

export default function ShiftManager({ staffId, staffName, userPermissions }: { staffId: string; staffName: string; userPermissions: string[] }) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState<Shift | null>(null);

  const canViewAll = userPermissions.length === 0 || userPermissions.includes("view:shifts");

  const fetchShifts = async () => {
    setLoading(true);
    const url = canViewAll ? "/api/shifts" : `/api/shifts?staffId=${staffId}`;
    const res = await fetch(url);
    if (res.ok) setShifts(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchShifts(); }, []);

  const openShift = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId, staffName }),
      });
      if (res.ok) {
        await fetchShifts();
        setSuccessMessage("Shift opened successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const err = await res.json();
        setAlertMessage(err.error || "Failed to open shift.");
      }
    } catch (e) {
      setAlertMessage("An unexpected error occurred.");
    }
    setSaving(false);
  };

  const closeShift = async () => {
    if (!confirmClose) return;
    setSaving(true);
    try {
      const res = await fetch("/api/shifts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shiftId: confirmClose.id }),
      });
      if (res.ok) {
        setConfirmClose(null);
        await fetchShifts();
        setSuccessMessage("Shift closed successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const err = await res.json();
        setAlertMessage(err.error || "Failed to close shift.");
      }
    } catch (e) {
      setAlertMessage("An unexpected error occurred.");
    }
    setSaving(false);
  };

  const activeShift = shifts.find(s => s.endTime === null && s.staffId === staffId);
  const history = shifts.filter(s => s.id !== activeShift?.id);

  // Compute live totals for the active shift
  let liveCash = 0, livePos = 0, liveTransfer = 0, liveUnpaid = 0;
  if (activeShift) {
    activeShift.orders.forEach(o => {
      if (o.status !== "completed") return; // Only count completed for totals
      if (o.payment === "cash") liveCash += o.totalRevenue;
      else if (o.payment === "pos") livePos += o.totalRevenue;
      else if (o.payment === "transfer") liveTransfer += o.totalRevenue;
      else if (o.payment === "unpaid") liveUnpaid += o.totalRevenue;
    });
  }

  const printZReport = (shift: Shift) => {
    const win = window.open("", "_blank", "width=320,height=600");
    if (!win) return;
    win.document.write(`
      <html><head><title>Z-Report ${shift.id}</title>
      <style>body{font-family:monospace;font-size:12px;padding:10px;width:280px}
        h2{text-align:center;font-size:14px;margin:0}hr{border-top:1px dashed #000}
        table{width:100%}td{padding:2px 0}.total{font-weight:bold;font-size:13px}
      </style></head>
      <body>
        <h2>ODM GROOVE - Z-REPORT</h2>
        <p style="text-align:center;margin:2px 0">Shift End</p>
        <hr>
        <p><b>Staff:</b> ${shift.staffName || shift.staffId}<br>
        <b>Start:</b> ${new Date(shift.startTime).toLocaleString()}<br>
        <b>End:</b> ${shift.endTime ? new Date(shift.endTime).toLocaleString() : "OPEN"}</p>
        <hr>
        <p><b>Sales Totals:</b></p>
        <table>
          <tr><td>Cash:</td><td style="text-align:right">₦${shift.cashTotal.toLocaleString()}</td></tr>
          <tr><td>POS:</td><td style="text-align:right">₦${shift.posTotal.toLocaleString()}</td></tr>
          <tr><td>Transfer:</td><td style="text-align:right">₦${shift.transferTotal.toLocaleString()}</td></tr>
        </table>
        <hr>
        <p class="total">Total Shift Sales: ₦${(shift.cashTotal + shift.posTotal + shift.transferTotal).toLocaleString()}</p>
        <hr>
        <p style="text-align:center">End of Report</p>
      </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="sticky top-0 z-20 bg-[var(--black)]/95 backdrop-blur-md pb-4 pt-6 -mx-6 px-6 -mt-6 mb-6 border-b border-[var(--dark-border)]">
        <h2 className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>Shift Management</h2>
        <p className="text-sm text-[var(--warm-gray)] mt-1">Open and close your shifts. Admin can view all historical shifts.</p>
      </div>

      {/* Current Shift Box */}
      <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl overflow-hidden">
        <div className="bg-[var(--black)] p-5 border-b border-[var(--dark-border)] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[var(--off-white)]">Current Shift</h3>
            <p className="text-xs text-[var(--warm-gray)] mt-1">
              {activeShift ? `Started at ${new Date(activeShift.startTime).toLocaleTimeString()}` : "You don't have an active shift."}
            </p>
          </div>
          {activeShift ? (
            <button onClick={() => setConfirmClose(activeShift)} disabled={saving}
              className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
              <Square size={14} fill="currentColor" /> {saving ? "Closing..." : "Close Shift"}
            </button>
          ) : (
            <button onClick={openShift} disabled={saving}
              className="btn-gold px-6 py-2 text-sm font-bold flex items-center gap-2 transition-all">
              <Play size={14} fill="currentColor" /> {saving ? "Opening..." : "Start Shift"}
            </button>
          )}
        </div>

        {activeShift && (
          <div className="p-5">
            <h4 className="text-xs font-semibold text-[var(--warm-gray)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calculator size={14} /> Live Running Totals
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Cash", val: liveCash, icon: <Banknote size={16} />, color: "text-green-400" },
                { label: "POS Terminal", val: livePos, icon: <CreditCard size={16} />, color: "text-blue-400" },
                { label: "Bank Transfer", val: liveTransfer, icon: <DollarSign size={16} />, color: "text-purple-400" },
                { label: "Unpaid / Open", val: liveUnpaid, icon: <Clock size={16} />, color: "text-amber-400" },
              ].map(t => (
                <div key={t.label} className="bg-[var(--black)] border border-[var(--dark-border)] rounded-xl p-4">
                  <div className={`w-8 h-8 rounded-lg bg-[var(--dark-card)] flex items-center justify-center mb-3 ${t.color}`}>{t.icon}</div>
                  <p className="text-xs text-[var(--warm-gray)]">{t.label}</p>
                  <p className="text-lg font-bold font-mono text-[var(--off-white)] mt-1">₦{(t.val || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
              Totals shown are for <strong>completed</strong> orders only. Ensure you cash out all "Open Tabs" before closing your shift.
            </div>
          </div>
        )}
      </div>

      {/* Shift History */}
      <div>
        <h3 className="font-bold text-[var(--off-white)] flex items-center gap-2 mb-4"><History size={16} className="text-[var(--gold)]" /> Shift History</h3>
        {loading ? (
          <p className="text-sm text-[var(--warm-gray)]">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-[var(--warm-gray)]">No past shifts found.</p>
        ) : (
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--dark-border)] text-[var(--warm-gray)] text-xs">
                  <th className="text-left px-4 py-3 font-semibold">Staff</th>
                  <th className="text-left px-4 py-3 font-semibold">Start Time</th>
                  <th className="text-left px-4 py-3 font-semibold">End Time</th>
                  <th className="text-right px-4 py-3 font-semibold">Cash Total</th>
                  <th className="text-right px-4 py-3 font-semibold">POS Total</th>
                  <th className="text-right px-4 py-3 font-semibold">Transfer Total</th>
                  <th className="text-center px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map(s => (
                  <tr key={s.id} className="border-b border-[var(--dark-border)]/50 hover:bg-[var(--black)] transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--off-white)]">{s.staffName || "—"}</td>
                    <td className="px-4 py-3 text-[var(--warm-gray)]">{new Date(s.startTime).toLocaleString("en-NG", { dateStyle: "short", timeStyle: "short" })}</td>
                    <td className="px-4 py-3 text-[var(--warm-gray)]">{s.endTime ? new Date(s.endTime).toLocaleString("en-NG", { dateStyle: "short", timeStyle: "short" }) : "—"}</td>
                    <td className="px-4 py-3 text-right text-green-400 font-mono">₦{(s.cashTotal || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-blue-400 font-mono">₦{(s.posTotal || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-purple-400 font-mono">₦{(s.transferTotal || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => printZReport(s)} className="text-xs font-semibold text-[var(--gold)] hover:underline">Z-Report</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmClose && (
        <ConfirmModal
          title="Close Shift?"
          message="Are you sure you want to end your shift? This will finalize your sales totals and generate a Z-Report."
          onConfirm={closeShift}
          onCancel={() => setConfirmClose(null)}
        />
      )}
      {alertMessage && <AlertModal title="Error" message={alertMessage} onClose={() => setAlertMessage(null)} />}
      
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
