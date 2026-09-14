"use client";

import Link from "next/link";

import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutContent() {
  const cart = useCartStore((state) => state.cart);

  if (cart.length === 0) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add some products before continuing to checkout.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Select a shipping address and complete your payment.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CheckoutForm />
        </div>

        <div className="lg:col-span-2">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
