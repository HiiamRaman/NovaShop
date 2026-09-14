import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

import type {
  OrderStatus,
  PaymentStatus,
  ProfileOrder,
} from "@/types/profile.types";

const orderStatusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-700",
};

interface ProfileOrdersProps {
  orders: ProfileOrder[];
}

export default function ProfileOrders({ orders }: ProfileOrdersProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Orders</h2>

          <p className="mt-1 text-sm text-slate-500">
            Review your previous purchases
          </p>
        </div>

        <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          {orders.length} orders
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/40 sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-bold text-slate-900">
                Order #{order.id.slice(-8)}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Order status
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-center text-xs font-bold capitalize ${
                    orderStatusColors[order.orderStatus]
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Payment status
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-center text-xs font-bold capitalize ${
                    paymentStatusColors[order.paymentStatus]
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              <p className="font-bold text-slate-900">
                {order.currency} {(order.total / 100).toLocaleString()}
              </p>

              <Link
                href={`/orders/${order.id}`}
                aria-label={`View order ${order.id}`}
                className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}

        {orders.length === 0 && (
          <div className="py-16 text-center">
            <Package className="mx-auto h-11 w-11 text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">No orders yet</h3>

            <p className="mt-1 text-sm text-slate-500">
              Your orders will appear here.
            </p>

            <Link
              href="/products"
              className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
