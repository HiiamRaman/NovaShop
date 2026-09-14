"use client";

import Image from "next/image";
import {
  ImageIcon,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import type { CartItem as CartItemType } from "@/types/cart.types";
import { useCartStore } from "@/store/cartStore";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({
  item,
}: CartItemProps) {
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  );

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  // Keep only images that contain a valid URL.
  const validImages =
    item.images
      ?.filter((image) => {
        return (
          typeof image.url === "string" &&
          image.url.trim() !== ""
        );
      })
      .slice()
      .sort((firstImage, secondImage) => {
        return firstImage.position - secondImage.position;
      }) ?? [];

  const firstImage = validImages[0];
  const imageUrl = firstImage?.url;

  const imageAlt =
    firstImage?.alt?.trim() ||
    item.name?.trim() ||
    "Cart product";

  // UPDATED:
  // Protect the UI from old or corrupted localStorage values.
  const quantity = Number.isFinite(item.quantity)
    ? item.quantity
    : 1;

  const priceInMinorUnit = Number.isFinite(
    item.priceInMinorUnit
  )
    ? item.priceInMinorUnit
    : 0;

  const stock = Number.isFinite(item.stock)
    ? item.stock
    : 0;

  // Convert minor units only when displaying prices.
  const unitPrice = priceInMinorUnit / 100;

  const lineTotal =
    (priceInMinorUnit * quantity) / 100;

  const isMaximumQuantity =
    quantity >= stock;

  return (
    <article className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:border-emerald-200 hover:shadow-md sm:flex-row sm:items-center sm:p-5">
      {/* Product image and information */}
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:h-24 sm:w-24">
          {/* Never render Next Image without a valid URL. */}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="96px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-7 w-7 text-slate-300" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            {item.name || "Unnamed product"}
          </h2>

          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            {item.brand || "NovaShop"}
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-700">
            {item.currency || "NPR"}{" "}
            {unitPrice.toLocaleString()}

            <span className="ml-1 text-xs font-normal text-slate-400">
              each
            </span>
          </p>

          {/* Mobile subtotal */}
          <p className="mt-2 text-xs font-medium text-slate-400 sm:hidden">
            Total:{" "}
            <span className="text-sm font-bold text-emerald-600">
              {item.currency || "NPR"}{" "}
              {lineTotal.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {/* Quantity and remove actions */}
      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:justify-end sm:border-t-0 sm:pt-0">
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => decreaseQuantity(item.id)}
            aria-label={`Decrease quantity of ${item.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900"
          >
            <Minus className="h-4 w-4" />
          </button>

          {/* UPDATED: Render the validated quantity. */}
          <span className="w-8 select-none text-center text-sm font-semibold text-slate-800">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => increaseQuantity(item.id)}
            disabled={isMaximumQuantity}
            aria-label={`Increase quantity of ${item.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Desktop subtotal */}
        <div className="hidden min-w-32 text-right sm:block">
          <p className="text-xs text-slate-400">
            Subtotal
          </p>

          <p className="mt-1 font-extrabold text-emerald-600">
            {item.currency || "NPR"}{" "}
            {lineTotal.toLocaleString()}
          </p>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
