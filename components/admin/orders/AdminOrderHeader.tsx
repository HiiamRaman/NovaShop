import { Calendar } from "lucide-react";

import type { OrderStatus, PaymentStatus } from "@/types/admin-order.types";

interface AdminOrderHeaderProps {
  orderId: string;
  createdAt: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
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

export default function AdminOrderHeader({
  orderId,
  createdAt,
  orderStatus,
  paymentStatus,
}: AdminOrderHeaderProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-200">
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />

      <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-100">Order details</p>

          <h1 className="mt-2 text-3xl font-bold">#{orderId.slice(-8)}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-indigo-100">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <StatusBadge
            value={orderStatus}
            className={orderStatusStyles[orderStatus]}
          />

          <StatusBadge
            value={paymentStatus}
            className={paymentStatusStyles[paymentStatus]}
          />
        </div>
      </div>
    </header>
  );
}

interface StatusBadgeProps {
  value: string;
  className: string;
}

function StatusBadge({ value, className }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${className}`}
    >
      {value}
    </span>
  );
}
