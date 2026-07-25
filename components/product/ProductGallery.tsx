"use client";

import Image from "next/image";
import { Product } from "@/types/products.types";
import { useState } from "react";

interface ProductGalleryProps {
  product: Product;
}

function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);

  return (
    <div className="space-y-6">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
        <Image
          src={selectedImage}
          alt={product.title}
          fill
          priority
          sizes="(max-w-768px) 100vw, 500px"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <section className="flex gap-4 overflow-x-auto">
        {product.images.map((image) => (
          <button
            key={image}
            onClick={() => setSelectedImage(image)}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 hover:border-emerald-500 transition"
          >
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </section>
    </div>
  );
}

export default ProductGallery;