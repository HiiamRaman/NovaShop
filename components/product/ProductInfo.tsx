"use client";

import { Product } from "@/types/products.types";
import AddToCartButton from "./AddToCartButton";
import { useState } from "react";
import QuantitySelector from "./QuantitySelector";

function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="sticky top-24 flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-md">
      {/* Category */}
      <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
        Premium
      </span>

      {/* Title */}
      <h1 className="mt-2 text-2xl font-bold leading-snug text-slate-900">
        {product.title}
      </h1>

      {/* Rating */}
      <div className="mt-2 flex items-center gap-2">
        <div className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
          ⭐ {product.rating.toFixed(1)}
        </div>
        <span className="text-xs text-slate-500">Verified</span>
      </div>

      {/* Price */}
      <div className="mt-3 border-y border-slate-200 py-2">
        <p className="text-[10px] uppercase tracking-wide text-slate-500">
          Price
        </p>
        <p className="mt-1 text-2xl font-black text-slate-900">
          ${product.price}
        </p>
      </div>

      {/* Description */}
      <div className="mt-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900">
          Description
        </h3>
        <p className="mt-1 text-sm leading-snug text-slate-600">
          {product.description}
        </p>
      </div>

      {/* Stock */}
      <div className="mt-3">
        {product.stock > 0 ? (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            ✓ In Stock ({product.stock})
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            ✕ Out of Stock
          </span>
        )}
      </div>

      {/* Quantity */}
      <div className="mt-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
          Quantity
        </p>
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </div>

      {/* Add To Cart */}
      <div className="mt-4 border-t border-slate-200 pt-3">
        <AddToCartButton
          product={product}
          quantity={quantity}
          onAdded={() => setQuantity(1)}
        />
      </div>
    </div>
  );
}

export default ProductInfo;
