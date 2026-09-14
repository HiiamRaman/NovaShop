"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ImageOff } from "lucide-react";

import type { Product } from "@/types/products.types";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  // UPDATED: Extract valid URLs because images are objects, not strings.
  const images = useMemo(
    () =>
      product.images
        ?.filter((image) => Boolean(image.url))
        .sort((firstImage, secondImage) => {
          return firstImage.position - secondImage.position;
        }) ?? [],
    [product.images]
  );

  const [selectedImage, setSelectedImage] = useState("");

  // UPDATED: Select the first valid image when the product loads.
  useEffect(() => {
    setSelectedImage(images[0]?.url ?? "");
  }, [images]);

  // UPDATED: Do not render Next Image with an empty src.
  if (images.length === 0 || !selectedImage) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl border border-slate-200 bg-slate-100">
        <div className="text-center text-slate-400">
          <ImageOff className="mx-auto h-12 w-12" />
          <p className="mt-3 text-sm font-medium">No product image available</p>
        </div>
      </div>
    );
  }

  return (
    <section>
      {/* Main selected image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <Image
          src={selectedImage}
          alt={product.name || "Product image"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6"
        />
      </div>

      {/* Product image thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image, index) => {
            const isSelected = selectedImage === image.url;

            return (
              <button
                // UPDATED: Use publicId instead of the entire object as key.
                key={image.publicId || `${image.url}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image.url)}
                aria-label={`View image ${index + 1}`}
                className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-white transition ${
                  isSelected
                    ? "border-emerald-500 ring-4 ring-emerald-100"
                    : "border-slate-200 hover:border-emerald-300"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${product.name} image ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
