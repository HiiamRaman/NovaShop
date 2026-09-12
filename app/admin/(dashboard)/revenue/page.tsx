"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CircleDollarSign,
  CreditCard,
  ReceiptText,
  TrendingUp,
} from "lucide-react";

import { api } from "@/lib/apiClient";
interface AdminOrder {
  id: string;
  total: number;
  currency: "NPR" | "USD";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
}
interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

export default function AdminRevenuePage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get("/api/admin/orders");
        const data = response.data as AdminOrder[];

        setOrders(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load revenue";

        toast.error("Unable to load revenue", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  // Revenue only includes successfully paid orders.
  const paidOrders = useMemo(() => {
    return orders.filter((order) => order.paymentStatus === "paid");
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return paidOrders.reduce((total, order) => total + order.total, 0);
  }, [paidOrders]);

  const averageOrder =
    paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

  const revenueData = useMemo<MonthlyRevenue[]>(() => {
    const monthlyData = new Map<string, MonthlyRevenue>();

    paidOrders.forEach((order) => {
      const date = new Date(order.createdAt);

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const monthLabel = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });

      const currentMonth = monthlyData.get(monthKey);

      if (currentMonth) {
        currentMonth.revenue += order.total;
        currentMonth.orders += 1;
      } else {
        monthlyData.set(monthKey, {
          month: monthLabel,
          revenue: order.total,
          orders: 1,
        });
      }
    });

    return Array.from(monthlyData.entries())
      .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
      .map(([, data]) => data);
  }, [paidOrders]);

  const summaries = [
    {
      label: "Total Revenue",
      value: `NPR ${(totalRevenue / 100).toLocaleString()}`,
      icon: CircleDollarSign,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Paid Orders",
      value: paidOrders.length.toString(),
      icon: CreditCard,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Average Order",
      value: `NPR ${(averageOrder / 100).toLocaleString()}`,
      icon: ReceiptText,
      color: "bg-amber-100 text-amber-700",
    },
  ];
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-7 text-white shadow-xl shadow-orange-200">
        <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-orange-100">
            <TrendingUp className="h-5 w-5" />

            <span className="text-sm font-medium">Financial Overview</span>
          </div>

          <h2 className="mt-2 text-3xl font-bold">Revenue</h2>

          <p className="mt-2 text-sm text-orange-100">
            Monitor paid orders and store performance.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {summaries.map((summary) => {
          const Icon = summary.icon;

          return (
            <article
              key={summary.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${summary.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {summary.label}
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.value}
              </p>
            </article>
          );
        })}
      </div>

      {/* Charts */}
      {revenueData.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">
          <CircleDollarSign className="mx-auto h-12 w-12 text-slate-300" />

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            No paid revenue yet
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Revenue information will appear after an order is paid.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Revenue chart */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900">Monthly Revenue</h3>

            <p className="mt-1 text-sm text-slate-400">
              Revenue from paid orders
            </p>

            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#f97316"
                        stopOpacity={0.35}
                      />

                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis dataKey="month" axisLine={false} tickLine={false} />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      (Number(value) / 100).toLocaleString()
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      `NPR ${(Number(value) / 100).toLocaleString()}`,
                      "Revenue",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          {/* Orders chart */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900">Paid Orders Per Month</h3>

            <p className="mt-1 text-sm text-slate-400">
              Successfully paid monthly orders
            </p>

            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis dataKey="month" axisLine={false} tickLine={false} />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />

                  <Tooltip
                    formatter={(value) => [Number(value), "Paid orders"]}
                  />

                  <Bar dataKey="orders" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
