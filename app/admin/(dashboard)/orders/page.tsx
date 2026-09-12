"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, PackageCheck, Search, ShoppingBag } from "lucide-react";
import { api } from "@/lib/apiClient";
type OrderStatus =
  "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

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

const orderStatusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue);

      const matchesStatus = status === "all" || order.orderStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get("/api/admin/orders");
        const data = response.data as AdminOrder[];

        setOrders(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load orders";

        toast.error("Unable to load orders", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-200">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-100">
            <PackageCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Order Management</span>
          </div>

          <h2 className="mt-2 text-3xl font-bold">Customer Orders</h2>

          <p className="mt-2 text-sm text-indigo-100">
            Review payments and manage delivery progress.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order or customer..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="all">All orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <span className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
              {filteredOrders.length} orders
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Order status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-indigo-50/40"
                  >
                    <td className="px-6 py-5">
                      <p className="font-bold text-indigo-600">
                        #{order.id.slice(-8)}
                      </p>
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-800">
                      {order.customer}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <ShoppingBag className="h-4 w-4" />
                        {order.itemCount}
                      </div>
                    </td>

                    <td className="px-6 py-5 font-bold text-slate-800">
                      {order.currency} {(order.total / 100).toLocaleString()}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                          orderStatusStyles[order.orderStatus]
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                          paymentStatusStyles[order.paymentStatus]
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                          aria-label="View order"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredOrders.length === 0 && (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-4 font-bold text-slate-800">No orders found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
