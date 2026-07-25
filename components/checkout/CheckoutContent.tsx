"use client";

import Link from "next/link";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { useCartStore } from "@/store/cartStore";

function CheckoutContent() {
  const cart = useCartStore((state) => state.cart);

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
            🛒
          </div>

          <h2 className="mt-6 text-3xl font-black text-slate-900">
            Your Cart is Empty
          </h2>

          <p className="mt-4 text-slate-500">
            Add products before continuing to checkout.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex rounded-full bg-emerald-600 px-10 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-5 items-start">

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

export default CheckoutContent;