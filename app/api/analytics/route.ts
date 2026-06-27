import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET — analytics with date range + department filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from"); // ISO date
  const to = searchParams.get("to");     // ISO date

  let dateFilter: { gte?: Date; lte?: Date } = {};
  if (from) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    dateFilter.gte = start;
  }
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    dateFilter.lte = end;
  }

  const orders = await prisma.foodOrder.findMany({
    where: {
      status: { not: "cancelled" },
      ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  // ── Overall totals ──
  const totalRevenue = orders.reduce((s, o) => s + o.totalRevenue, 0);
  const totalCost = orders.reduce((s, o) => s + o.totalCost, 0);
  const netProfit = totalRevenue - totalCost;
  const totalOrders = orders.length;

  // ── Department breakdown ──
  const deptMap: Record<string, { revenue: number; cost: number; profit: number; orders: number }> = {};
  for (const o of orders) {
    if (!deptMap[o.department]) {
      deptMap[o.department] = { revenue: 0, cost: 0, profit: 0, orders: 0 };
    }
    deptMap[o.department].revenue += o.totalRevenue;
    deptMap[o.department].cost += o.totalCost;
    deptMap[o.department].profit += o.profit;
    deptMap[o.department].orders += 1;
  }
  const departments = Object.entries(deptMap).map(([name, stats]) => ({ name, ...stats }));

  // ── Staff performance ──
  const staffMap: Record<string, { name: string; email: string; revenue: number; cost: number; profit: number; orders: number }> = {};
  for (const o of orders) {
    if (!o.createdById || !o.createdBy) continue;
    const key = o.createdById;
    if (!staffMap[key]) {
      staffMap[key] = {
        name: o.createdBy.name || o.createdBy.email,
        email: o.createdBy.email,
        revenue: 0, cost: 0, profit: 0, orders: 0,
      };
    }
    staffMap[key].revenue += o.totalRevenue;
    staffMap[key].cost += o.totalCost;
    staffMap[key].profit += o.profit;
    staffMap[key].orders += 1;
  }
  const staffPerformance = Object.values(staffMap).sort((a, b) => b.revenue - a.revenue);

  // ── Top selling items ──
  const itemMap: Record<string, { name: string; qty: number; revenue: number; profit: number }> = {};
  for (const o of orders) {
    try {
      const items: { name: string; qty: number; unitPrice: number; unitCost: number }[] = JSON.parse(o.items);
      for (const item of items) {
        if (!itemMap[item.name]) {
          itemMap[item.name] = { name: item.name, qty: 0, revenue: 0, profit: 0 };
        }
        itemMap[item.name].qty += item.qty;
        itemMap[item.name].revenue += item.unitPrice * item.qty;
        itemMap[item.name].profit += (item.unitPrice - item.unitCost) * item.qty;
      }
    } catch {}
  }
  const topItems = Object.values(itemMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // ── Payment method split ──
  const paymentSplit = {
    cash: orders.filter(o => o.payment === "cash").reduce((s, o) => s + o.totalRevenue, 0),
    pos: orders.filter(o => o.payment === "pos").reduce((s, o) => s + o.totalRevenue, 0),
    transfer: orders.filter(o => o.payment === "transfer").reduce((s, o) => s + o.totalRevenue, 0),
    unpaid: orders.filter(o => o.payment === "unpaid").reduce((s, o) => s + o.totalRevenue, 0),
  };

  return NextResponse.json({
    totalRevenue,
    totalCost,
    netProfit,
    totalOrders,
    departments,
    staffPerformance,
    topItems,
    paymentSplit,
  });
}
