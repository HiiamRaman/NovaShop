"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
export default function CartSummary() {
  const cart = useCartStore((state) => state.cart);

  const subTotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Items</span>

          <span className="font-semibold">{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>

          <span className="font-semibold">${subTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>

          <span className="text-emerald-600 font-semibold">Free</span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>${subTotal.toFixed(2)}</span>
        </div>

        <Link
          href="/checkout"
          className="
    block
    w-full
    mt-6
    rounded-full
    bg-emerald-600
    py-3
    text-center
    font-semibold
    text-white
    transition
    hover:bg-emerald-700
  "
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
