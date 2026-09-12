"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Package,
  ReceiptText,
  TrendingUp,
  Users,
} from "lucide-react";

import { api } from "@/lib/apiClient";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

interface AdminOrder {
  id: string;
  customer: string;
  itemCount: number;
  total: number;
  currency: "NPR" | "USD";
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

interface Customer {
  id: string;
  fullName: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
}

interface ProductsResponseData {
  products: unknown[];

  pagination: {
    currentPage: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
  };
}

interface SalesData {
  month: string;
  amount: number;
}

interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) {
    return "NPR 0";
  }

  return `NPR ${(value / 100).toLocaleString()}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPaymentStatusStyle(status: PaymentStatus) {
  if (status === "paid") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "failed") {
    return "bg-red-100 text-red-700";
  }

  if (status === "refunded") {
    return "bg-slate-100 text-slate-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          ordersResponse,
          customersResponse,
          productsResponse,
        ] = await Promise.all([
          api.get("/api/admin/orders"),
          api.get("/api/admin/customers"),
          api.get("/api/admin/products"),
        ]);

        const ordersData =
          ordersResponse.data as AdminOrder[];

        const customersData =
          customersResponse.data as Customer[];

        const productsData =
          productsResponse.data as ProductsResponseData;

        setOrders(ordersData);
        setCustomers(customersData);
        setProductCount(
          productsData.pagination.totalProducts
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load dashboard";

        toast.error("Unable to load dashboard", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const paidOrders = useMemo(() => {
    return orders.filter(
      (order) => order.paymentStatus === "paid"
    );
  }, [orders]);

  const totalSales = useMemo(() => {
    return paidOrders.reduce(
      (total, order) => total + order.total,
      0
    );
  }, [paidOrders]);

  const statistics = [
    {
      label: "Total Users",
      value: customers.length.toLocaleString(),
      change: "Live",
      icon: Users,
      color: "from-emerald-400 to-teal-500",
    },
    {
      label: "Total Orders",
      value: orders.length.toLocaleString(),
      change: "Live",
      icon: ReceiptText,
      color: "from-indigo-500 to-violet-500",
    },
    {
      label: "Total Sales",
      value: formatMoney(totalSales),
      change: "Paid",
      icon: TrendingUp,
      color: "from-amber-400 to-orange-500",
    },
    {
      label: "Total Products",
      value: productCount.toLocaleString(),
      change: "Live",
      icon: Package,
      color: "from-rose-400 to-red-500",
    },
  ];

  const sales = useMemo<SalesData[]>(() => {
    const monthlySales = new Map<string, SalesData>();

    paidOrders.forEach((order) => {
      const date = new Date(order.createdAt);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const month = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });

      const existingMonth = monthlySales.get(key);

      if (existingMonth) {
        existingMonth.amount += order.total;
      } else {
        monthlySales.set(key, {
          month,
          amount: order.total,
        });
      }
    });

    return Array.from(monthlySales.entries())
      .sort(([firstKey], [secondKey]) =>
        firstKey.localeCompare(secondKey)
      )
      .map(([, data]) => data);
  }, [paidOrders]);

  const orderStatuses = useMemo<OrderStatusData[]>(() => {
    const totalOrders = orders.length;

    function getPercentage(count: number) {
      if (totalOrders === 0) {
        return 0;
      }

      return Math.round((count / totalOrders) * 100);
    }

    const deliveredOrders = orders.filter(
      (order) => order.orderStatus === "delivered"
    ).length;

    const processingOrders = orders.filter(
      (order) =>
        order.orderStatus === "confirmed" ||
        order.orderStatus === "shipped"
    ).length;

    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "pending"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.orderStatus === "cancelled"
    ).length;

    return [
      {
        name: "Delivered",
        value: getPercentage(deliveredOrders),
        color: "#14b8a6",
      },
      {
        name: "Processing",
        value: getPercentage(processingOrders),
        color: "#6366f1",
      },
      {
        name: "Pending",
        value: getPercentage(pendingOrders),
        color: "#f59e0b",
      },
      {
        name: "Cancelled",
        value: getPercentage(cancelledOrders),
        color: "#ef4444",
      },
    ];
  }, [orders]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5).map((order) => ({
      id: order.id,
      customer: order.customer,
      date: formatDate(order.createdAt),
      total: formatMoney(order.total),
      status: order.paymentStatus,
    }));
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <section>
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Here is your store performance.
        </p>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <article
              key={statistic.label}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${statistic.color} p-6 text-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl motion-reduce:transform-none`}
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

              <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-black/5 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/20 backdrop-blur-sm transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    {statistic.change}
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-sm font-medium text-white/75">
                    {statistic.label}
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight">
                    {statistic.value}
                  </p>
                </div>

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-2/3 rounded-full bg-white/70 transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Sales chart */}
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900">
                Sales Overview
              </h3>

              <p className="text-sm text-slate-400">
                Monthly paid revenue
              </p>
            </div>

            <span className="text-xl font-bold text-slate-900">
              {formatMoney(totalSales)}
            </span>
          </div>

          {sales.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center text-center">
              <TrendingUp className="h-10 w-10 text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                No paid sales yet
              </p>
            </div>
          ) : (
            <div className="mt-6 h-72">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart data={sales}>
                  <defs>
                    <linearGradient
                      id="salesColor"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="95%"
                        stopColor="#6366f1"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      (
                        Number(value) / 100
                      ).toLocaleString()
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatMoney(Number(value)),
                      "Sales",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#salesColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        {/* Order status chart */}
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">
            Order Status
          </h3>

          <p className="text-sm text-slate-400">
            Current distribution
          </p>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatuses}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {orderStatuses.map((status) => (
                    <Cell
                      key={status.name}
                      fill={status.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    `${Number(value)}%`,
                    "Orders",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {orderStatuses.map((status) => (
              <div
                key={status.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: status.color,
                    }}
                  />

                  <span className="text-slate-500">
                    {status.name}
                  </span>
                </div>

                <span className="font-semibold text-slate-800">
                  {status.value}%
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* Recent orders */}
      <article className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h3 className="font-bold text-slate-900">
              Recent Orders
            </h3>

            <p className="text-sm text-slate-400">
              Latest customer purchases
            </p>
          </div>

          <Package className="h-5 w-5 text-indigo-500" />
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ReceiptText className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 font-semibold text-slate-700">
              No orders found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-indigo-50/40"
                  >
                    <td className="px-6 py-4 font-semibold text-indigo-600">
                      #{order.id.slice(-8)}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {order.customer}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {order.date}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {order.total}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
