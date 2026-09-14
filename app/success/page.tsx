"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ShoppingBag,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";

import { api } from "@/lib/apiClient";
import { useCartStore } from "@/store/cartStore";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

interface Order {
  id: string;
  total: number;
  currency: "NPR" | "USD";
  orderStatus: string;
  paymentStatus: PaymentStatus;
}

function SuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");

  const clearCart = useCartStore((state) => state.clearCart);

  const [order, setOrder] = useState<Order | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId || !sessionId) {
      setError("Payment information is missing.");
      setIsLoading(false);
      return;
    }

    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function checkOrder() {
      try {
        const response = await api.get(`/api/orders/${orderId}`);

        const currentOrder = response.data as Order;

        setOrder(currentOrder);
        setIsLoading(false);

        if (currentOrder.paymentStatus === "paid") {
          // Clear the cart only after payment is verified.
          clearCart();
          return;
        }

        if (
          currentOrder.paymentStatus === "failed" ||
          currentOrder.paymentStatus === "refunded"
        ) {
          return;
        }

        attempts += 1;

        // Give the Stripe webhook time to update MongoDB.
        if (attempts < 10) {
          timeoutId = setTimeout(checkOrder, 2000);
        } else {
          setError("Payment confirmation is taking longer than expected.");
        }
      } catch (requestError) {
        setIsLoading(false);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to verify payment."
        );
      }
    }

    checkOrder();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [orderId, sessionId, clearCart]);

  if (isLoading) {
    return (
      <StatusMessage
        icon={
          <LoaderCircle className="h-12 w-12 animate-spin text-emerald-600" />
        }
        title="Confirming your payment"
        description="Please wait while we verify your payment with Stripe."
      />
    );
  }

  if (error || !order || order.paymentStatus !== "paid") {
    return (
      <StatusMessage
        icon={
          order?.paymentStatus === "pending" && !error ? (
            <Clock3 className="h-12 w-12 text-amber-500" />
          ) : (
            <AlertCircle className="h-12 w-12 text-red-500" />
          )
        }
        title={
          order?.paymentStatus === "pending"
            ? "Payment is processing"
            : "Payment could not be confirmed"
        }
        description={error || "Stripe has not confirmed this payment yet."}
      />
    );
  }

  const total = order.total / 100;

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-5 py-10">
      <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl">
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-600 to-teal-500" />

        <header className="px-7 py-9 text-center sm:px-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-11 w-11 text-emerald-600" />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">
            Payment verified
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-900">
            Your order is confirmed
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            Thank you for shopping with NovaShop. Your payment was received and
            your order is being prepared.
          </p>
        </header>

        <div className="mx-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:mx-8">
          <div className="flex justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-700">
                Order
              </p>

              <p className="mt-1 font-bold text-slate-900">
                #{order.id.slice(-8)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold uppercase text-emerald-700">
                Total paid
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {order.currency} {total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8">
          <Link
            href="/orders"
            className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <ShoppingBag className="h-4 w-4" />
            View My Orders
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>

          <Link
            href="/products"
            className="flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

interface StatusMessageProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function StatusMessage({ icon, title, description }: StatusMessageProps) {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <div className="flex justify-center">{icon}</div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>

        <Link
          href="/orders"
          className="mt-7 inline-flex rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
        >
          View My Orders
        </Link>
      </section>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <StatusMessage
          icon={
            <LoaderCircle className="h-12 w-12 animate-spin text-emerald-600" />
          }
          title="Loading payment"
          description="Please wait a moment."
        />
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
