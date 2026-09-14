"use client";

import Image from "next/image";
import { ImageIcon, ReceiptText } from "lucide-react";

import { useCartStore } from "@/store/cartStore";

export default function OrderSummary() {
  const cart = useCartStore((state) => state.cart);

  const subtotalInMinorUnit = cart.reduce((total, item) => {
    const price = Number.isFinite(item.priceInMinorUnit)
      ? item.priceInMinorUnit
      : 0;

    const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;

    return total + price * quantity;
  }, 0);

  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const currency = cart[0]?.currency ?? "NPR";

  function formatMoney(amountInMinorUnit: number) {
    return new Intl.NumberFormat("en-NP", {
      maximumFractionDigits: 2,
    }).format(amountInMinorUnit / 100);
  }

  return (
    <aside className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2.5">
              <ReceiptText className="h-5 w-5" />
            </div>

            <h2 className="text-xl font-bold">Order Summary</h2>
          </div>

          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="max-h-[420px] space-y-4 overflow-y-auto">
          {cart.map((item) => {
            const firstImage = item.images
              ?.filter(
                (image) =>
                  typeof image.url === "string" && image.url.trim() !== ""
              )
              .slice()
              .sort((first, second) => first.position - second.position)[0];

            const imageUrl = firstImage?.url;

            const imageAlt =
              firstImage?.alt?.trim() || item.name || "Product image";

            const lineTotal = item.priceInMinorUnit * item.quantity;

            return (
              <article
                key={item.id}
                className="flex gap-4 border-b border-slate-100 pb-4 last:border-0"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {currency} {formatMoney(item.priceInMinorUnit)} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-slate-900">
                    {currency} {formatMoney(lineTotal)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>

            <span className="font-semibold text-slate-900">
              {currency} {formatMoney(subtotalInMinorUnit)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-slate-600">
            <span>Shipping</span>

            <span className="font-semibold text-emerald-600">Free</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4">
            <span className="font-bold text-slate-900">Total</span>

            <span className="text-xl font-black text-emerald-600">
              {currency} {formatMoney(subtotalInMinorUnit)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
