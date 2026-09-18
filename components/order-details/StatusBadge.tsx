import { CheckCircle2, Clock3, Truck, XCircle } from "lucide-react";

import { formatOrderStatus } from "@/utils/orderFormatters";

interface StatusBadgeProps {
  type: "order" | "payment";
  status: string;
}

export default function StatusBadge({ type, status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
        normalizedStatus
      )}`}
    >
      {getStatusIcon(normalizedStatus)}
      {type === "order" ? "Order" : "Payment"}: {formatOrderStatus(status)}
    </span>
  );
}

function getStatusStyle(status: string) {
  if (status === "paid" || status === "delivered" || status === "completed") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (
    status === "cancelled" ||
    status === "canceled" ||
    status === "failed" ||
    status === "expired"
  ) {
    return "bg-red-100 text-red-700";
  }

  if (status === "shipped" || status === "out_for_delivery") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-amber-100 text-amber-700";
}

function getStatusIcon(status: string) {
  if (status === "paid" || status === "delivered" || status === "completed") {
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  }

  if (
    status === "cancelled" ||
    status === "canceled" ||
    status === "failed" ||
    status === "expired"
  ) {
    return <XCircle className="h-3.5 w-3.5" />;
  }

  if (status === "shipped" || status === "out_for_delivery") {
    return <Truck className="h-3.5 w-3.5" />;
  }

  return <Clock3 className="h-3.5 w-3.5" />;
}
