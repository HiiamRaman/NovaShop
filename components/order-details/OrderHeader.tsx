import { Calendar, LoaderCircle, XCircle } from "lucide-react";

import StatusBadge from "./StatusBadge";
import { formatOrderDate } from "@/utils/orderFormatters";

import type { CustomerOrderDetails } from "@/types/order-details.types";

interface OrderHeaderProps {
  order: CustomerOrderDetails;
  canCancel: boolean;
  isCancelling: boolean;
  onCancel: () => void;
}

export default function OrderHeader({
  order,
  canCancel,
  isCancelling,
  onCancel,
}: OrderHeaderProps) {
  return (
    <header className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 p-7 text-white shadow-xl">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />

      <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-emerald-200">Order details</p>

          <h1 className="mt-2 text-3xl font-bold">
            Order #{order.id.slice(-8)}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-sm text-slate-300">
            <Calendar className="h-4 w-4" />
            {formatOrderDate(order.createdAt)}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <StatusBadge type="order" status={order.orderStatus} />

            <StatusBadge type="payment" status={order.paymentStatus} />
          </div>

          {canCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isCancelling}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isCancelling ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}

              {isCancelling ? "Cancelling..." : "Cancel order"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
