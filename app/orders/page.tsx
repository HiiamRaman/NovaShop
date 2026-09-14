"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  ShoppingBag,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import ProfileOrders from "@/components/profile/ProfileOrders";
import type { ProfileOrder } from "@/types/profile.types";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] =
    useState<ProfileOrder[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get(
          "/api/orders"
        );

        setOrders(
          response.data as ProfileOrder[]
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load orders";

        toast.error("Orders unavailable", {
          description: message,
        });

        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-100">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <ShoppingBag className="h-5 w-5" />

              <span className="text-sm font-semibold">
                Your purchases
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Order History
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your payments and delivery progress.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Continue Shopping
          </Link>
        </header>

        <ProfileOrders orders={orders} />
      </div>
    </main>
  );
}
