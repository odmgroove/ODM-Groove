"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, BarChart3, Users,
  Calendar, ChevronDown, RefreshCw, Award, Star
} from "lucide-react";
import DatePicker from "@/app/components/DatePicker";

type Analytics = {
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  totalOrders: number;
  departments: { name: string; revenue: number; cost: number; profit: number; orders: number }[];
  staffPerformance: { name: string; email: string; revenue: number; cost: number; profit: number; orders: number }[];
  topItems: { name: string; qty: number; revenue: number; profit: number }[];
  paymentSplit: { cash: number; pos: number; transfer: number; unpaid: number };
};

type DatePreset = "today" | "yesterday" | "7d" | "30d" | "custom";

function fmt(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}k`;
  return `₦${n.toLocaleString()}`;
}

function KpiCard({ label, value, sub, icon, accent = "gold" }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; accent?: "gold" | "green" | "red" | "blue";
}) {
  const colors = {
    gold: "text-[var(--gold)] bg-[var(--gold)]/10 border-[var(--gold)]/20",
    green: "text-green-400 bg-green-400/10 border-green-400/20",
    red: "text-red-400 bg-red-400/10 border-red-400/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  };
  return (
    <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-5 space-y-3">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[accent]}`}>{icon}</div>
      <div>
        <p className="text-xs text-[var(--warm-gray)]">{label}</p>
        <p className="text-2xl font-bold text-[var(--off-white)] mt-0.5">{value}</p>
        {sub && <p className="text-xs text-[var(--warm-gray)] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AnalyticsManager() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<DatePreset>("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const getDateRange = (p: DatePreset) => {
    const now = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    if (p === "today") return { from: fmt(now), to: fmt(now) };
    if (p === "yesterday") {
      const y = new Date(now); y.setDate(y.getDate() - 1);
      return { from: fmt(y), to: fmt(y) };
    }
    if (p === "7d") {
      const s = new Date(now); s.setDate(s.getDate() - 7);
      return { from: fmt(s), to: fmt(now) };
    }
    if (p === "30d") {
      const s = new Date(now); s.setDate(s.getDate() - 30);
      return { from: fmt(s), to: fmt(now) };
    }
    return { from: customFrom, to: customTo };
  };

  const fetchData = async () => {
    setLoading(true);
    const { from, to } = getDateRange(preset);
    if (!from || !to) { setLoading(false); return; }
    const params = new URLSearchParams({ from, to });
    const res = await fetch(`/api/analytics?${params}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [preset]);

  const PRESET_LABELS: Record<DatePreset, string> = {
    today: "Today", yesterday: "Yesterday", "7d": "Last 7 Days", "30d": "Last 30 Days", custom: "Custom Range",
  };

  const maxRevenue = data ? Math.max(...data.departments.map(d => d.revenue), 1) : 1;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--black)]/95 backdrop-blur-md pb-4 pt-6 -mx-6 px-6 -mt-6 mb-6 border-b border-[var(--dark-border)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>Analytics</h2>
          <p className="text-sm text-[var(--warm-gray)] mt-1">Revenue, profit, and performance reports.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Presets */}
          <div className="flex gap-1">
            {(["today", "yesterday", "7d", "30d", "custom"] as DatePreset[]).map(p => (
              <button key={p} onClick={() => setPreset(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all
                  ${preset === p ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/40"}`}>
                {PRESET_LABELS[p]}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Custom Range */}
      {preset === "custom" && (
        <div className="flex gap-3 flex-wrap">
          <div className="w-[180px]">
            <DatePicker
              label="From"
              selected={customFrom ? new Date(customFrom) : null}
              maxDate={customTo ? new Date(customTo) : undefined}
              onSelect={d => {
                const tzOffset = d.getTimezoneOffset() * 60000;
                setCustomFrom(new Date(d.getTime() - tzOffset).toISOString().split('T')[0]);
              }}
            />
          </div>
          <div className="w-[180px]">
            <DatePicker
              label="To"
              selected={customTo ? new Date(customTo) : null}
              minDate={customFrom ? new Date(customFrom) : undefined}
              maxDate={new Date()}
              onSelect={d => {
                const tzOffset = d.getTimezoneOffset() * 60000;
                setCustomTo(new Date(d.getTime() - tzOffset).toISOString().split('T')[0]);
              }}
            />
          </div>
          <div className="flex items-end">
            <button onClick={fetchData} className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[var(--gold)]/10 h-[42px]">Apply</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--gold)]" />
        </div>
      ) : !data ? (
        <p className="text-center py-12 text-[var(--warm-gray)]">No data found for the selected period.</p>
      ) : (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Revenue" value={fmt(data.totalRevenue)} sub={`${data.totalOrders} orders`} icon={<DollarSign size={20} />} accent="gold" />
            <KpiCard label="Total Cost" value={fmt(data.totalCost)} sub={`${data.departments.length} departments`} icon={<TrendingDown size={20} />} accent="red" />
            <KpiCard label="Net Profit" value={fmt(data.netProfit)} sub={data.totalRevenue > 0 ? `${((data.netProfit / data.totalRevenue) * 100).toFixed(1)}% margin` : "—"} icon={<TrendingUp size={20} />} accent={data.netProfit >= 0 ? "green" : "red"} />
            <KpiCard label="Total Orders" value={data.totalOrders.toString()} sub="Completed & active" icon={<ShoppingBag size={20} />} accent="blue" />
          </div>

          {/* Department Breakdown */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-5">
            <h3 className="font-bold text-[var(--off-white)] flex items-center gap-2 mb-5"><BarChart3 size={16} className="text-[var(--gold)]" /> Department Breakdown</h3>
            {data.departments.length === 0 ? (
              <p className="text-center py-6 text-[var(--warm-gray)] text-sm">No department data.</p>
            ) : (
              <div className="space-y-4">
                {data.departments.sort((a, b) => b.revenue - a.revenue).map(dept => (
                  <div key={dept.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[var(--off-white)]">{dept.name}</span>
                      <div className="flex gap-4 text-xs text-right">
                        <span className="text-[var(--warm-gray)]">Revenue: <span className="text-[var(--gold)] font-bold">{fmt(dept.revenue)}</span></span>
                        <span className="text-[var(--warm-gray)]">Profit: <span className={`font-bold ${dept.profit >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(dept.profit)}</span></span>
                        <span className="text-[var(--warm-gray)]">{dept.orders} orders</span>
                      </div>
                    </div>
                    <div className="h-2 bg-[var(--black)] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/60 rounded-full transition-all duration-700"
                        style={{ width: `${(dept.revenue / maxRevenue) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Split */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-5">
            <h3 className="font-bold text-[var(--off-white)] mb-4">Payment Methods</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Cash", value: data.paymentSplit.cash, color: "text-green-400" },
                { label: "POS Terminal", value: data.paymentSplit.pos, color: "text-blue-400" },
                { label: "Transfer", value: data.paymentSplit.transfer, color: "text-purple-400" },
                { label: "Unpaid", value: data.paymentSplit.unpaid, color: "text-amber-400" },
              ].map(p => (
                <div key={p.label} className="text-center p-4 bg-[var(--black)] rounded-xl border border-[var(--dark-border)]">
                  <p className={`text-xl font-bold font-mono ${p.color}`}>{fmt(p.value)}</p>
                  <p className="text-xs text-[var(--warm-gray)] mt-1">{p.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Staff Performance */}
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-5">
              <h3 className="font-bold text-[var(--off-white)] flex items-center gap-2 mb-4"><Users size={16} className="text-[var(--gold)]" /> Staff Performance</h3>
              {data.staffPerformance.length === 0 ? (
                <p className="text-sm text-[var(--warm-gray)] text-center py-4">No staff orders in this period.</p>
              ) : (
                <div className="space-y-3">
                  {data.staffPerformance.map((s, i) => (
                    <div key={s.email} className="flex items-center gap-3 p-3 bg-[var(--black)] rounded-xl border border-[var(--dark-border)]">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                        ${i === 0 ? "bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30" :
                          i === 1 ? "bg-zinc-400/20 text-zinc-400 border border-zinc-400/30" :
                          i === 2 ? "bg-amber-700/20 text-amber-700 border border-amber-700/30" :
                          "bg-[var(--dark-border)]/50 text-[var(--warm-gray)] border border-[var(--dark-border)]"}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--off-white)] truncate">{s.name}</p>
                        <p className="text-[10px] text-[var(--warm-gray)]">{s.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[var(--gold)] font-mono">{fmt(s.revenue)}</p>
                        <p className={`text-[10px] font-mono ${s.profit >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(s.profit)} profit</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Items */}
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-5">
              <h3 className="font-bold text-[var(--off-white)] flex items-center gap-2 mb-4"><Star size={16} className="text-[var(--gold)]" /> Top Selling Items</h3>
              {data.topItems.length === 0 ? (
                <p className="text-sm text-[var(--warm-gray)] text-center py-4">No items sold in this period.</p>
              ) : (
                <div className="space-y-2">
                  {data.topItems.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3 py-2 border-b border-[var(--dark-border)]/50 last:border-0">
                      <span className="text-xs font-bold text-[var(--warm-gray)] w-5">{i + 1}</span>
                      <span className="flex-1 text-sm text-[var(--off-white)] truncate">{item.name}</span>
                      <span className="text-xs text-[var(--warm-gray)] shrink-0">×{item.qty}</span>
                      <span className="text-sm font-bold text-[var(--gold)] font-mono shrink-0">{fmt(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
