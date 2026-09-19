"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import CreateProductForm from "./CreateProductForm";

export interface ProductCategoryOption {
  id: string;
  name: string;
  isActive: boolean;
}

export default function NewProductContent() {
  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/api/admin/categories");

        const data = response.data as ProductCategoryOption[];

        // Products can only be created inside active categories.
        setCategories(data.filter((category) => category.isActive));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load categories";

        toast.error("Categories unavailable", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div
          role="status"
          aria-label="Loading categories"
          className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
        />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <header className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-7 text-white shadow-xl shadow-indigo-200">
        <div className="flex items-center gap-2 text-indigo-100">
          <PackagePlus className="h-5 w-5" />

          <span className="text-sm font-medium">Product Management</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold">Add Product</h1>

        <p className="mt-2 text-sm text-indigo-100">
          Create a new product and upload its images.
        </p>
      </header>

      {categories.length > 0 ? (
        <CreateProductForm categories={categories} />
      ) : (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h2 className="font-bold text-amber-800">No active categories</h2>

          <p className="mt-2 text-sm text-amber-700">
            Create or activate a category before adding a product.
          </p>

          <Link
            href="/admin/categories"
            className="mt-5 inline-flex rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white"
          >
            Manage Categories
          </Link>
        </div>
      )}
    </section>
  );
}
