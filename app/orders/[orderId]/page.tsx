"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  ImageIcon,
  LoaderCircle,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  Truck,
  UserRound,
  Wallet,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

interface OrderDetails {
  id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function OrderDetailsPage() {
  const params = useParams<{
    orderId: string;
  }>();

  const orderId = params.orderId;

  const [order, setOrder] = useState<OrderDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await api.get(`/api/orders/${orderId}`);

        setOrder(response.data as OrderDetails);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load order";

        toast.error("Could not load order", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Package className="mx-auto h-14 w-14 text-slate-300" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Order not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This order does not exist or does not belong to your account.
          </p>

          <Link
            href="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my orders
        </Link>

        {/* Order header */}
        <header className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 p-7 text-white shadow-xl">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-emerald-200">
                Order details
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Order #{order.id.slice(-8)}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                <Calendar className="h-4 w-4" />

                {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge type="order" status={order.orderStatus} />

              <StatusBadge type="payment" status={order.paymentStatus} />
            </div>
          </div>
        </header>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Products */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Order items
                  </h2>

                  <p className="text-sm text-slate-500">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "product" : "products"}
                  </p>
                </div>
              </div>

              <div className="mt-6 divide-y divide-slate-100">
                {order.items.map((item) => (
                  <OrderItemCard
                    key={item.productId}
                    item={item}
                    currency={order.currency}
                  />
                ))}
              </div>
            </section>

            {/* Shipping information */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Shipping information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Delivery details for this order
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InformationItem
                  icon={<UserRound className="h-5 w-5" />}
                  label="Recipient"
                  value={order.shippingAddress.fullName}
                />

                <InformationItem
                  icon={<Phone className="h-5 w-5" />}
                  label="Phone"
                  value={order.shippingAddress.phone}
                />

                <InformationItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Delivery address"
                  value={`${order.shippingAddress.address}, ${order.shippingAddress.city}`}
                  fullWidth
                />
              </div>
            </section>
          </div>

          {/* Payment summary */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                <ReceiptText className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Payment summary
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <SummaryLine
                label="Subtotal"
                value={`${order.currency} ${formatMoney(order.subtotal)}`}
              />

              <SummaryLine
                label="Shipping"
                value={
                  order.shipping === 0
                    ? "Free"
                    : `${order.currency} ${formatMoney(order.shipping)}`
                }
                highlight={order.shipping === 0}
              />

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-emerald-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total</p>

                    <p className="mt-1 text-xs text-slate-400">
                      Including all charges
                    </p>
                  </div>

                  <p className="text-xl font-black text-emerald-700">
                    {order.currency} {formatMoney(order.total)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                <Wallet className="h-5 w-5 text-slate-400" />

                <div>
                  <p className="text-xs text-slate-400">Payment status</p>

                  <p className="mt-1 font-semibold capitalize text-slate-800">
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface OrderItemCardProps {
  item: OrderItem;
  currency: string;
}

function OrderItemCard({ item, currency }: OrderItemCardProps) {
  const hasImage = typeof item.image === "string" && item.image.trim() !== "";

  return (
    <article className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
        {hasImage ? (
          <Image
            src={item.image as string}
            alt={item.name || "Order product"}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-7 w-7 text-slate-300" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-bold text-slate-900">{item.name}</h3>

          <p className="mt-2 text-sm text-slate-500">
            {currency} {formatMoney(item.unitPrice)} × {item.quantity}
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-xs text-slate-400">Line total</p>

          <p className="mt-1 font-bold text-slate-900">
            {currency} {formatMoney(item.lineTotal)}
          </p>
        </div>
      </div>
    </article>
  );
}

interface InformationItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}

function InformationItem({
  icon,
  label,
  value,
  fullWidth = false,
}: InformationItemProps) {
  return (
    <div
      className={`rounded-2xl bg-slate-50 p-4 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-emerald-600">{icon}</div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface SummaryLineProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function SummaryLine({ label, value, highlight = false }: SummaryLineProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>

      <span
        className={
          highlight
            ? "font-semibold text-emerald-600"
            : "font-semibold text-slate-900"
        }
      >
        {value}
      </span>
    </div>
  );
}

interface StatusBadgeProps {
  type: "order" | "payment";
  status: string;
}

function StatusBadge({ type, status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const badgeStyle = getStatusStyle(normalizedStatus);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${badgeStyle}`}
    >
      {getStatusIcon(normalizedStatus)}
      {type === "order" ? "Order" : "Payment"}: {formatStatus(status)}
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

function formatStatus(status: string) {
  return status.replaceAll("_", " ").replaceAll("-", " ");
}

// The backend stores money in minor units.
// Example: 14500000 becomes NPR 145,000.
function formatMoney(amountInMinorUnit: number) {
  const safeAmount = Number.isFinite(amountInMinorUnit) ? amountInMinorUnit : 0;

  return new Intl.NumberFormat("en-NP", {
    maximumFractionDigits: 2,
  }).format(safeAmount / 100);
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
