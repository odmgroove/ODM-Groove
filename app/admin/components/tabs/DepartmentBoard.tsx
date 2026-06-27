"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChefHat, Wine, ShoppingBag, Clock, CheckCircle2, Circle, AlertCircle,
  Plus, Printer, CreditCard, RefreshCw, Volume2, VolumeX, Filter,
  User, MapPin, MessageSquare, ArrowRight, X, ChevronDown
} from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  unitCost: number;
  category: string;
};

type Order = {
  id: string;
  ref: string;
  customerName: string;
  type: string;
  department: string;
  location: string | null;
  message: string | null;
  items: string;
  totalRevenue: number;
  totalCost: number;
  profit: number;
  payment: string;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: { id: string; name: string; email: string } | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "New",       color: "text-red-400 bg-red-400/10 border-red-400/30",    icon: <Circle size={12} /> },
  preparing:  { label: "Preparing", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: <RefreshCw size={12} className="animate-spin" /> },
  open_tab:   { label: "Open Tab",  color: "text-purple-400 bg-purple-400/10 border-purple-400/30", icon: <Wine size={12} /> },
  completed:  { label: "Done",      color: "text-green-400 bg-green-400/10 border-green-400/30", icon: <CheckCircle2 size={12} /> },
  cancelled:  { label: "Cancelled", color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/30",  icon: <X size={12} /> },
};

const PAYMENT_LABELS: Record<string, string> = {
  unpaid: "Unpaid", cash: "Cash", transfer: "Transfer", pos: "POS Terminal",
};

function useLiveTimer(createdAt: string) {
  const [elapsed, setElapsed] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
      if (diff < 60) setElapsed(`${diff}s ago`);
      else if (diff < 3600) setElapsed(`${Math.floor(diff / 60)}m ago`);
      else setElapsed(`${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m ago`);
    };
    update();
    const t = setInterval(update, 15000);
    return () => clearInterval(t);
  }, [createdAt]);
  return elapsed;
}

function ElapsedBadge({ createdAt }: { createdAt: string }) {
  const elapsed = useLiveTimer(createdAt);
  const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  const urgent = mins >= 15;
  const warning = mins >= 8 && mins < 15;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
      ${urgent ? "text-red-400 bg-red-400/15 border-red-400/40 animate-pulse" :
        warning ? "text-amber-400 bg-amber-400/15 border-amber-400/40" :
        "text-[var(--warm-gray)] bg-[var(--black)] border-[var(--dark-border)]"}`}>
      <Clock size={10} />
      {elapsed}
    </span>
  );
}

function OrderCard({
  order,
  onStatusChange,
  onPaymentChange,
}: {
  order: Order;
  onStatusChange: (id: string, status: string) => void;
  onPaymentChange: (id: string, payment: string) => void;
}) {
  const items: OrderItem[] = (() => { try { return JSON.parse(order.items); } catch { return []; } })();
  const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const mins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=320,height=600");
    if (!win) return;
    win.document.write(`
      <html><head><title>Receipt #${order.ref}</title>
      <style>body{font-family:monospace;font-size:12px;padding:10px;width:280px}
        h2{text-align:center;font-size:14px;margin:0}hr{border-top:1px dashed #000}
        table{width:100%}td{padding:2px 0}.total{font-weight:bold;font-size:13px}
      </style></head>
      <body>
        <h2>ODM GROOVE</h2>
        <p style="text-align:center;margin:2px 0">Order #${order.ref}</p>
        <hr>
        <p><b>Customer:</b> ${order.customerName}<br>
        <b>Type:</b> ${order.type}${order.location ? ` — ${order.location}` : ""}<br>
        <b>Dept:</b> ${order.department}</p>
        <hr>
        <table>${items.map(i => `<tr><td>${i.name} x${i.qty}</td><td style="text-align:right">₦${(i.unitPrice * i.qty).toLocaleString()}</td></tr>`).join("")}</table>
        <hr>
        <p class="total">Total: ₦${order.totalRevenue.toLocaleString()}</p>
        <p>Payment: ${PAYMENT_LABELS[order.payment]}</p>
        <hr>
        ${order.message ? `<p>Note: ${order.message}</p><hr>` : ""}
        <p style="text-align:center">Thank you!</p>
      </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className={`bg-[var(--dark-card)] border rounded-xl overflow-hidden transition-all duration-300
      ${order.status === "pending" && mins < 2 ? "border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]" :
        mins >= 15 ? "border-amber-500/40" : "border-[var(--dark-border)]"}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--dark-border)] gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[var(--gold)] font-mono font-bold text-xs bg-[var(--gold)]/10 px-2 py-0.5 rounded border border-[var(--gold)]/20">
            {order.ref}
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusConf.color}`}>
            {statusConf.icon}{statusConf.label}
          </span>
        </div>
        <ElapsedBadge createdAt={order.createdAt} />
      </div>

      {/* Customer info */}
      <div className="px-3 pt-2 pb-1 space-y-0.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--off-white)]">
          <User size={12} className="text-[var(--warm-gray)] shrink-0" />
          {order.customerName}
          <span className="ml-auto text-[10px] font-normal text-[var(--warm-gray)] capitalize">{order.type}</span>
        </div>
        {order.location && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--warm-gray)]">
            <MapPin size={11} className="shrink-0" /> {order.location}
          </div>
        )}
        {order.message && (
          <div className="flex items-start gap-1.5 text-xs text-amber-400/80 bg-amber-400/5 rounded px-2 py-1 mt-1">
            <MessageSquare size={11} className="shrink-0 mt-0.5" /> {order.message}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="px-3 py-2 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-[var(--off-white)]">
              <span className="text-[var(--gold)] font-bold mr-1">×{item.qty}</span>
              {item.name}
            </span>
            <span className="text-[var(--warm-gray)] font-mono">₦{(item.unitPrice * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Total + Payment */}
      <div className="px-3 pb-2 flex items-center justify-between">
        <span className="text-[var(--gold)] font-bold font-mono text-sm">₦{order.totalRevenue.toLocaleString()}</span>
        <div className="relative">
          <select
            value={order.payment}
            onChange={(e) => onPaymentChange(order.id, e.target.value)}
            className="appearance-none text-[10px] bg-[var(--black)] border border-[var(--dark-border)] rounded pl-2 pr-6 py-0.5 text-[var(--warm-gray)] outline-none cursor-pointer hover:border-[var(--gold)]/50 focus:border-[var(--gold)]"
          >
            {Object.entries(PAYMENT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] pointer-events-none" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-t border-[var(--dark-border)] p-2 flex gap-1.5">
        {order.status === "pending" && (
          <button onClick={() => onStatusChange(order.id, "preparing")}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all">
            <RefreshCw size={12} /> Start
          </button>
        )}
        {order.status === "preparing" && (
          <>
            <button onClick={() => onStatusChange(order.id, "open_tab")}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-all">
              <Wine size={12} /> Open Tab
            </button>
            <button onClick={() => onStatusChange(order.id, "completed")}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all">
              <CheckCircle2 size={12} /> Done
            </button>
          </>
        )}
        {order.status === "open_tab" && (
          <button onClick={() => onStatusChange(order.id, "completed")}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all">
            <CreditCard size={12} /> Cash Out
          </button>
        )}
        <button onClick={handlePrint}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all border border-transparent hover:border-[var(--gold)]/20">
          <Printer size={14} />
        </button>
      </div>
    </div>
  );
}

import AlertModal from "../AlertModal";

type DeptFilter = "all" | "Kitchen" | "Bar" | string;

export default function DepartmentBoard({ userPermissions }: { userPermissions?: string[] }) {
  const perms = userPermissions || [];
  const canSeeKitchen = perms.includes("view:kitchen");
  const canSeeBar = perms.includes("view:bar");
  const isSuperOrAdmin = perms.length === 0 || perms.includes("manage:staff"); // admin sees all

  const today = new Date().toISOString().split("T")[0];
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState<DeptFilter>("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastCount, setLastCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams({ date: today });
    if (dept !== "all") params.set("department", dept);
    const res = await fetch(`/api/orders?${params.toString()}`);
    if (res.ok) {
      const data: Order[] = await res.json();
      setOrders(data);
      setLoading(false);
      // Sound notification for new orders
      const pendingCount = data.filter(o => o.status === "pending").length;
      if (pendingCount > lastCount && lastCount > 0 && soundEnabled) {
        audioRef.current?.play().catch(() => {});
      }
      setLastCount(pendingCount);
    }
  }, [dept, today, lastCount, soundEnabled]);

  useEffect(() => {
    fetchOrders();
    pollRef.current = setInterval(fetchOrders, 10000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      } else {
        setAlertMessage(`Error updating status: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while updating status.");
    }
  };

  const updatePayment = async (id: string, payment: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, payment } : o));
      } else {
        setAlertMessage(`Error updating payment: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while updating payment.");
    }
  };

  const visible = orders.filter(o => {
    if (!showCompleted && (o.status === "completed" || o.status === "cancelled")) return false;
    if (!isSuperOrAdmin) {
      if (o.department === "Kitchen" && !canSeeKitchen) return false;
      if (o.department === "Bar" && !canSeeBar) return false;
    }
    if (dept !== "all" && o.department !== dept) return false;
    return true;
  });

  const pendingCount = visible.filter(o => o.status === "pending").length;
  const preparingCount = visible.filter(o => o.status === "preparing").length;
  const openTabCount = visible.filter(o => o.status === "open_tab").length;

  return (
    <div className="p-4 space-y-4">
      {/* ── Audio ── */}
      <audio ref={audioRef} src="/sounds/ding.mp3" preload="auto" />

      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}

      {/* ── Unified Sticky Header Area ── */}
      <div className="sticky top-0 z-20 bg-[var(--black)]/95 backdrop-blur-md pb-2 pt-6 -mx-6 px-6 -mt-6 border-b border-[var(--dark-border)] mb-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>
              Live Orders Board
            </h2>
            <p className="text-xs text-[var(--warm-gray)] mt-0.5">
              {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })} · Auto-refreshes every 10s
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* KPI Chips */}
            {pendingCount > 0 && (
              <span className="animate-pulse text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                {pendingCount} New
              </span>
            )}
            {preparingCount > 0 && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {preparingCount} Preparing
              </span>
            )}
            {openTabCount > 0 && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {openTabCount} Open Tabs
              </span>
            )}
            <button onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all"
              title={soundEnabled ? "Mute notifications" : "Unmute notifications"}>
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <button onClick={fetchOrders}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap pb-2">
          {[
            { key: "all", label: "All Depts", icon: <Filter size={12} /> },
            ...(isSuperOrAdmin || canSeeKitchen ? [{ key: "Kitchen", label: "Kitchen", icon: <ChefHat size={12} /> }] : []),
            ...(isSuperOrAdmin || canSeeBar ? [{ key: "Bar", label: "Bar", icon: <Wine size={12} /> }] : []),
            { key: "Pool", label: "Pool", icon: <ShoppingBag size={12} /> },
            { key: "Snooker", label: "Snooker", icon: <ShoppingBag size={12} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setDept(tab.key as DeptFilter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all
                ${dept === tab.key
                  ? "bg-[var(--gold)] text-black border-[var(--gold)]"
                  : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/40 hover:text-[var(--off-white)]"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all
              ${showCompleted ? "bg-green-500/20 text-green-400 border-green-500/30" : "text-[var(--warm-gray)] border-[var(--dark-border)]"}`}>
            <CheckCircle2 size={12} /> {showCompleted ? "Hiding Done" : "Show Done"}
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--gold)]" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-24 text-[var(--warm-gray)]">
          <ChefHat size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-semibold">No active orders right now</p>
          <p className="text-xs mt-1 opacity-60">New orders will appear here automatically</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={updateStatus}
              onPaymentChange={updatePayment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
