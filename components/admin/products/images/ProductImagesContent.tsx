"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Images } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import ProductImageManager from "./ProductImageManager";

import type { AdminProduct, ProductImageData } from "@/types/products.types";

interface ProductImagesContentProps {
  productId: string;
}

export default function ProductImagesContent({
  productId,
}: ProductImagesContentProps) {
  const [product, setProduct] = useState<AdminProduct | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await api.get(`/api/admin/products/${productId}`);

        setProduct(response.data as AdminProduct);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load product";

        toast.error("Product unavailable", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  function handleImagesUpdated(images: ProductImageData[]) {
    setProduct((currentProduct) => {
      if (!currentProduct) {
        return currentProduct;
      }

      return {
        ...currentProduct,
        images,
      };
    });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>

        <Link
          href="/admin/products"
          className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
        >
          Return to products
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <Link
        href={`/admin/products/${product.id}/edit`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to product
      </Link>

      <header className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-200">
        <div className="flex items-center gap-2 text-indigo-100">
          <Images className="h-5 w-5" />
          Product Media
        </div>

        <h1 className="mt-2 text-3xl font-bold">Manage Images</h1>

        <p className="mt-2 text-sm text-indigo-100">{product.name}</p>
      </header>

      <ProductImageManager
        productId={product.id}
        images={product.images}
        onImagesUpdated={handleImagesUpdated}
      />
    </section>
  );
}
