"use client";

import Link from "next/link";
import {
  ReceiptText,
  ShoppingBag,
} from "lucide-react";

import { useCartStore } from "@/store/cartStore";

export default function CartSummary() {
  const cart = useCartStore((state) => state.cart);

  // Calculate totals using database minor units.
  const subtotalInMinorUnit = cart.reduce(
    (total, item) => {
      return (
        total +
        item.priceInMinorUnit * item.quantity
      );
    },
    0
  );

  const totalItems = cart.reduce(
    (total, item) => {
      return total + item.quantity;
    },
    0
  );

  // Convert the final amount from minor units for display.
  const subtotal = subtotalInMinorUnit / 100;

  const shipping = 0;
  const total = subtotal + shipping;

  // All NovaShop cart products should use the same currency.
  const currency = cart[0]?.currency ?? "NPR";

  return (
    <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2.5">
            <ReceiptText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <p className="mt-1 text-sm text-emerald-100">
              Review your purchase total
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-500">
              <ShoppingBag className="h-4 w-4" />
              Items
            </span>

            <span className="font-semibold text-slate-800">
              {totalItems}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-semibold text-slate-800">
              {currency} {subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Shipping
            </span>

            <span className="font-semibold text-emerald-600">
              Free
            </span>
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-slate-200" />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Total
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Including shipping
            </p>
          </div>

          <p className="text-2xl font-extrabold text-slate-900">
            {currency} {total.toLocaleString()}
          </p>
        </div>

        <Link
          href="/checkout"
          className="mt-7 block w-full rounded-xl bg-emerald-600 py-3.5 text-center font-bold text-white shadow-md shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
        >
          Proceed to Checkout
        </Link>

        <p className="mt-4 text-center text-xs text-slate-400">
          Final prices and stock will be verified during checkout.
        </p>
      </div>
    </aside>
  );
}
