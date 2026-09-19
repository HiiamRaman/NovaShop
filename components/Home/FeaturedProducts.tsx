import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { env } from "@/lib/env";
import ProductCard from "@/components/product/productCard";

import type { Product, ProductsResponseData } from "@/types/products.types";

interface ProductsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ProductsResponseData;
}

export default async function FeaturedProducts() {
  /*
  Use the public API so the Server Component receives
  plain JSON instead of Mongoose documents.
  */
  const response = await fetch(
    `${env.APP_URL}/api/products?page=1&limit=4&sort=newest`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch featured products");
  }

  const result = (await response.json()) as ProductsApiResponse;

  const featuredProducts: Product[] = result.data.products;

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Our Collection
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Featured Products
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              Discover the latest products selected from our active collection.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2 font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
