"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ImageIcon,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/types/products.types";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  // UPDATED:
  // Remove images that do not have a valid URL before sorting.
  const validImages =
    product.images
      ?.filter((image) => {
        return (
          typeof image.url === "string" &&
          image.url.trim() !== ""
        );
      })
      .slice()
      .sort((firstImage, secondImage) => {
        return (
          firstImage.position -
          secondImage.position
        );
      }) ?? [];

  // UPDATED:
  // The first image is now guaranteed to contain a valid URL.
  const firstImage = validImages[0];

  const imageUrl = firstImage?.url;

  // UPDATED:
  // Always provide useful alternative text.
  const imageAlt =
    firstImage?.alt?.trim() ||
    product.name?.trim() ||
    "NovaShop product";

  const isOutOfStock = product.stock <= 0;

  function handleAddToCart() {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart(product, 1);

    toast.success("Added to cart", {
      description: product.name,
    });
  }

  return (
    <article className="group mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product details link */}
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col"
      >
        <div className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-100">
          {/* UPDATED:
              Never render Next Image without a valid src. */}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 700px) 100vw, 300px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-10 w-10 text-slate-300" />
            </div>
          )}

          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
              isOutOfStock
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isOutOfStock
              ? "Out of stock"
              : `${product.stock} available`}
          </span>
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            {product.brand}
          </p>

          <h2 className="mt-1 line-clamp-1 text-lg font-bold text-slate-900 transition group-hover:text-emerald-600">
            {product.name}
          </h2>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
            {product.description}
          </p>

          <p className="mt-auto pt-4 text-xl font-bold text-slate-900">
            {product.currency}{" "}
            {(
              product.priceInMinorUnit / 100
            ).toLocaleString()}
          </p>
        </div>
      </Link>

      {/* Cart action */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <ShoppingCart className="h-4 w-4" />

        {isOutOfStock
          ? "Out of Stock"
          : "Add to Cart"}
      </button>
    </article>
  );
}
