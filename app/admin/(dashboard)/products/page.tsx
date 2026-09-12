"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  ImageIcon,
  Package,
  PackageSearch,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/apiClient";

import type { Product, ProductsResponseData } from "@/types/products.types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get("/api/admin/products");
        const data = response.data as ProductsResponseData;
        setProducts(data.products);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch products";

        toast.error("Unable to load products", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchValue) ||
        product.brand.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue)
    );
  }, [products, search]);

  return (
    <section className="space-y-6">
      {/* Page header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-7 text-white shadow-xl shadow-indigo-200">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-40 h-44 w-44 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-indigo-100">
              <Package className="h-5 w-5" />

              <span className="text-sm font-medium">Product Management</span>
            </div>

            <h2 className="mt-2 text-3xl font-bold">Products</h2>

            <p className="mt-2 max-w-lg text-sm text-indigo-100">
              Manage product information, pricing and stock.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Products table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product, brand or SKU..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            {filteredProducts.length} products
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold">Product</th>

                    <th className="px-6 py-4 font-semibold">Brand</th>

                    <th className="px-6 py-4 font-semibold">Price</th>

                    <th className="px-6 py-4 font-semibold">Stock</th>

                    <th className="px-6 py-4 font-semibold">Status</th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const firstImage = product.images
                      .slice()
                      .sort((a, b) => a.position - b.position)[0];

                    return (
                      <tr
                        key={product.id}
                        className="group transition duration-200 hover:bg-indigo-50/40"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition group-hover:scale-105">
                              {firstImage ? (
                                <img
                                  src={firstImage.url}
                                  alt={firstImage.alt || product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-6 w-6 text-slate-400" />
                              )}
                            </div>

                            <div>
                              <p className="font-bold text-slate-800">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                SKU: {product.sku}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 font-medium text-slate-600">
                          {product.brand}
                        </td>

                        <td className="px-6 py-5 font-bold text-slate-800">
                          {product.currency}{" "}
                          {(product.priceInMinorUnit / 100).toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                              product.stock === 0
                                ? "bg-red-50 text-red-600"
                                : product.stock <= 10
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                              product.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                product.status === "active"
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />

                            {product.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              aria-label={`Edit ${product.name}`}
                              className="rounded-xl border border-indigo-100 bg-indigo-50 p-2.5 text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              aria-label={`Delete ${product.name}`}
                              className="rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <PackageSearch className="h-7 w-7 text-slate-400" />
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No products found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try searching with a different name, brand or SKU.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
