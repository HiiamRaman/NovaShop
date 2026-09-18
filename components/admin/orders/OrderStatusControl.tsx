"use client";

import { CheckCircle2, LoaderCircle, PackageCheck, Truck } from "lucide-react";

import type {
  NextOrderStatus,
  OrderStatus,
  PaymentStatus,
} from "@/types/admin-order.types";

interface OrderStatusControlProps {
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  isUpdating: boolean;
  onUpdate: (nextStatus: NextOrderStatus) => Promise<void>;
}

interface StatusAction {
  nextStatus: NextOrderStatus;
  label: string;
  description: string;
  icon: typeof PackageCheck;
}

const statusActions: Partial<Record<OrderStatus, StatusAction>> = {
  pending: {
    nextStatus: "confirmed",
    label: "Confirm Order",
    description: "Confirm that this paid order is ready for processing.",
    icon: PackageCheck,
  },

  confirmed: {
    nextStatus: "shipped",
    label: "Mark as Shipped",
    description: "Mark this order as handed over for delivery.",
    icon: Truck,
  },

  shipped: {
    nextStatus: "delivered",
    label: "Mark as Delivered",
    description: "Confirm that the customer received this order.",
    icon: CheckCircle2,
  },
};

export default function OrderStatusControl({
  orderStatus,
  paymentStatus,
  isUpdating,
  onUpdate,
}: OrderStatusControlProps) {
  if (orderStatus === "cancelled") {
    return (
      <StatusMessage
        title="Order cancelled"
        description="No further delivery actions are available."
        className="border-red-200 bg-red-50 text-red-700"
      />
    );
  }

  if (orderStatus === "delivered") {
    return (
      <StatusMessage
        title="Delivery completed"
        description="This order has already been delivered."
        className="border-emerald-200 bg-emerald-50 text-emerald-700"
      />
    );
  }

  if (paymentStatus !== "paid") {
    return (
      <StatusMessage
        title="Waiting for payment"
        description="The delivery workflow becomes available after payment is confirmed."
        className="border-amber-200 bg-amber-50 text-amber-700"
      />
    );
  }

  const action = statusActions[orderStatus];

  if (!action) {
    return null;
  }

  const ActionIcon = action.icon;

  return (
    <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            Delivery workflow
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Next: {action.label}
          </h2>

          <p className="mt-2 text-sm text-slate-600">{action.description}</p>
        </div>

        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onUpdate(action.nextStatus)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUpdating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <ActionIcon className="h-4 w-4" />
          )}

          {isUpdating ? "Updating..." : action.label}
        </button>
      </div>
    </section>
  );
}

interface StatusMessageProps {
  title: string;
  description: string;
  className: string;
}

function StatusMessage({ title, description, className }: StatusMessageProps) {
  return (
    <section className={`rounded-3xl border p-6 ${className}`}>
      <h2 className="font-bold">{title}</h2>

      <p className="mt-1 text-sm">{description}</p>
    </section>
  );
}
