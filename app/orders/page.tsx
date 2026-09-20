"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LoaderCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import ProfileOrders from "@/components/profile/ProfileOrders";

import type { ProfileOrder } from "@/types/profile.types";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<ProfileOrder[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignoreResponse = false;

    async function loadOrders() {
      try {
        const response = await api.get("/api/orders");

        if (ignoreResponse) {
          return;
        }

        setOrders(response.data as ProfileOrder[]);
      } catch (error) {
        if (ignoreResponse) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unable to load orders";

        toast.error("Orders unavailable", {
          description: message,
        });

        if (isAuthenticationError(message)) {
          router.replace("/login?redirect=/orders");
        }
      } finally {
        if (!ignoreResponse) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      ignoreResponse = true;
    };
  }, [router]);

  if (isLoading) {
    return <OrdersLoadingState />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Soft page background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.09),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.08),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.05),_transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <OrdersHeader orderCount={orders.length} />

        <section className="mt-8">
          <ProfileOrders orders={orders} />
        </section>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                Secure order history
              </p>

              <p className="text-sm text-slate-500">
                Only you can view your purchases and delivery details.
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700 sm:w-auto"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}

interface OrdersHeaderProps {
  orderCount: number;
}

function OrdersHeader({ orderCount }: OrdersHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-6 py-9 text-white shadow-xl shadow-emerald-200/60 sm:px-9">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />

      <div className="absolute -bottom-24 right-36 h-52 w-52 rounded-full bg-white/10" />

      <div className="absolute left-1/2 top-0 h-32 w-32 rounded-full bg-sky-300/10 blur-2xl" />

      <div className="relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-emerald-100">
            <Sparkles className="h-4 w-4" />

            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Your purchases
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Order History
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
            Review your purchases, payment information and delivery progress.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
            <PackageCheck className="h-5 w-5" />
          </div>

          <div>
            <p className="text-2xl font-black">{orderCount}</p>

            <p className="text-xs font-medium text-emerald-100">
              {orderCount === 1 ? "Order placed" : "Orders placed"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function OrdersLoadingState() {
  return (
    <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-slate-50 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_35%)]" />

      <div className="relative rounded-3xl border border-slate-200 bg-white/90 px-10 py-9 text-center shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <LoaderCircle className="h-8 w-8 animate-spin" />
        </div>

        <h1 className="mt-5 text-xl font-bold text-slate-900">
          Loading your orders
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Fetching your latest purchase information...
        </p>
      </div>
    </main>
  );
}

function isAuthenticationError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("authentication required") ||
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("invalid access token")
  );
}
