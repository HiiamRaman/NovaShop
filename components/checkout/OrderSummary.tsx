"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

function OrderSummary() {
  const cart = useCartStore((state) => state.cart);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="sticky top-24 mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-md s">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          {totalItems} items
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 border-b border-slate-100 pb-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 justify-between gap-3">
              <div>
                <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>

              <p className="text-sm font-bold text-slate-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-slate-200 pt-4">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm text-slate-600">
          <span>Shipping</span>
          <span className="font-semibold text-emerald-600">Free</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <span className="text-base font-bold text-slate-900">Total</span>
          <span className="text-xl font-black text-emerald-600">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;








