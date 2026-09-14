"use client";

import { PackageCheck, PackageX, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/types/products.types";
import { useCartStore } from "@/store/cartStore";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({
  product,
}: ProductInfoProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const isOutOfStock = product.stock <= 0;

  // UPDATED: API stores money in minor units.
  const formattedPrice = (
    product.priceInMinorUnit / 100
  ).toLocaleString();

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
    <section>
      {/* UPDATED: API uses name instead of title. */}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {product.name}
      </h1>

      <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">
        {product.brand}
      </p>

      {/* UPDATED: API uses priceInMinorUnit and currency. */}
      <p className="mt-6 text-3xl font-bold text-slate-900">
        {product.currency} {formattedPrice}
      </p>

      <div className="mt-5">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            <PackageX className="h-4 w-4" />
            Out of stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            <PackageCheck className="h-4 w-4" />
            {product.stock} available
          </span>
        )}
      </div>

      <p className="mt-7 leading-7 text-slate-600">
        {product.description}
      </p>

      <button
        type="button"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
      >
        <ShoppingCart className="h-5 w-5" />
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </section>
  );
}
