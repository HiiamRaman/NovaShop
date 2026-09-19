"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import EditProductForm from "./EditProductForm";
import ProductInventoryControls from "./ProductInventoryControls";

import type { AdminProduct } from "@/types/products.types";

export interface ProductCategoryOption {
  id: string;
  name: string;
  isActive: boolean;
}

interface EditProductContentProps {
  productId: string;
}

export default function EditProductContent({
  productId,
}: EditProductContentProps) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  
  function handleStockUpdated(stock: number) {
    setProduct((currentProduct) => {
      if (!currentProduct) return currentProduct;
      return { ...currentProduct, stock };
    });
  }

  function handleStatusUpdated(status: AdminProduct["status"]) {
    setProduct((currentProduct) => {
      if (!currentProduct) return currentProduct;
      return { ...currentProduct, status };
    });
  }

  useEffect(() => {
    async function loadEditData() {
      try {
        setIsLoading(true);

        const [productResponse, categoriesResponse] = await Promise.all([
          api.get(`/api/admin/products/${productId}`),
          api.get("/api/admin/categories"),
        ]);

        setProduct(productResponse.data as AdminProduct);
        setCategories(categoriesResponse.data as ProductCategoryOption[]);
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

    if (productId) {
      loadEditData();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div
          role="status"
          aria-label="Loading product"
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
        />
        <p className="text-sm font-medium text-slate-500">
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <Package className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Product not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The product you are trying to edit does not exist or has been removed.
        </p>
        <Link
          href="/admin/products"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          Return to products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Link
          href="/admin/products"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <header className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Product
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update the details, pricing, and inventory for{" "}
              <span className="font-semibold text-slate-700">
                {product.name}
              </span>
            </p>
          </div>
        </header>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Main Form (Takes up 2/3 of the space on desktop) */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <EditProductForm product={product} categories={categories} />
          </div>
        </div>

        {/* Right Column: Controls (Takes up 1/3 of the space on desktop) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Inventory & Status
            </h2>
            <ProductInventoryControls
              productId={product.id}
              initialStock={product.stock}
              initialStatus={product.status}
              onStockUpdated={handleStockUpdated}
              onStatusUpdated={handleStatusUpdated}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
