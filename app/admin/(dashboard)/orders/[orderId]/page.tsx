"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import { toast } from "sonner";

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

interface OrderItem {
  productId: string;
  name: string;
  image: string;
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

interface AdminOrderDetails {
  id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
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

export default function AdminOrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const [order, setOrder] =
    useState<AdminOrderDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await api.get(
          `/api/admin/orders/${orderId}`
        );

        const data = response.data as AdminOrderDetails;

        setOrder(data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load order";

        toast.error("Unable to load order", {
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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <Package className="h-14 w-14 text-slate-300" />

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Order not found
        </h1>

        <Link
          href="/admin/orders"
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
        >
          Return to orders
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-200">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-100">
              Order details
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              #{order.id.slice(-8)}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-indigo-100">
              <Calendar className="h-4 w-4" />

              {new Date(order.createdAt).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${
                orderStatusStyles[order.orderStatus]
              }`}
            >
              {order.orderStatus}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${
                paymentStatusStyles[order.paymentStatus]
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Ordered items
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {order.items.length} product types in this order
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <article
                key={item.productId}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-slate-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Unit price: {order.currency}{" "}
                    {(item.unitPrice / 100).toLocaleString()}
                  </p>
                </div>

                <p className="font-bold text-slate-900">
                  {order.currency}{" "}
                  {(item.lineTotal / 100).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer address */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                <MapPin className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Shipping address
              </h2>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-slate-400" />

                <span className="font-semibold text-slate-800">
                  {order.shippingAddress.fullName}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-slate-400" />

                <span className="text-slate-600">
                  {order.shippingAddress.phone}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />

                <span className="text-slate-600">
                  {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}
                </span>
              </div>
            </div>
          </div>

          {/* Payment summary */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <CreditCard className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Payment summary
              </h2>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Subtotal
                </span>

                <span className="font-semibold text-slate-800">
                  {order.currency}{" "}
                  {(order.subtotal / 100).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Shipping
                </span>

                <span className="font-semibold text-emerald-600">
                  {order.shipping === 0
                    ? "Free"
                    : `${order.currency} ${(
                        order.shipping / 100
                      ).toLocaleString()}`}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-lg font-bold text-indigo-600">
                    {order.currency}{" "}
                    {(order.total / 100).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
