import Link from "next/link";
import {
  Boxes,
  PackageSearch,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import ProductCard from "@/components/product/productCard";
import CategoryFilter from "@/components/product/categoryFilter";
import SortDropdown from "@/components/product/SortDropdown";
import Pagination from "@/components/product/Pagination";

import { env } from "@/lib/env";

import type { PublicCategory } from "@/types/category.types";
import type {
  Product,
  ProductsResponseData,
  ProductSortOption,
} from "@/types/products.types";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

interface ProductsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ProductsResponseData;
}

interface CategoriesApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: PublicCategory[];
}

interface ProductQueryInput {
  search?: string;
  category?: string;
  sort?: string;
  page?: string;
}

interface ProductsHeaderProps {
  search?: string;
  selectedCategory?: PublicCategory;
  visibleProducts: number;
  totalProducts: number;
}

const PRODUCTS_PER_PAGE = 8;

const allowedSortValues: ProductSortOption[] = [
  "newest",
  "price-low-to-high",
  "price-high-to-low",
  "name-a-to-z",
];

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { search, category, sort, page } = await searchParams;

  const query = buildProductQuery({
    search,
    category,
    sort,
    page,
  });

  const productsUrl = `${env.APP_URL}/api/products?${query.toString()}`;

  const categoriesUrl = `${env.APP_URL}/api/categories`;

  const [productsResponse, categoriesResponse] = await Promise.all([
    fetch(productsUrl, {
      cache: "no-store",
    }),

    fetch(categoriesUrl, {
      cache: "no-store",
    }),
  ]);

  if (!productsResponse.ok) {
    const responseBody = await productsResponse.text();

    console.error("Product API request failed", {
      url: productsUrl,
      status: productsResponse.status,
      responseBody,
    });

    throw new Error(`Failed to fetch products (${productsResponse.status})`);
  }

  if (!categoriesResponse.ok) {
    const responseBody = await categoriesResponse.text();

    console.error("Category API request failed", {
      url: categoriesUrl,
      status: categoriesResponse.status,
      responseBody,
    });

    throw new Error(
      `Failed to fetch categories (${categoriesResponse.status})`
    );
  }

  const productsResult = (await productsResponse.json()) as ProductsApiResponse;

  const categoriesResult =
    (await categoriesResponse.json()) as CategoriesApiResponse;

  const products: Product[] = productsResult.data.products;

  const pagination = productsResult.data.pagination;

  const categories = categoriesResult.data;

  const selectedCategory = categories.find(
    (currentCategory) => currentCategory.id === category
  );

  return (
    <main className="min-h-screen bg-slate-50 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.07),_transparent_28%)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <ProductsHeader
          search={search}
          selectedCategory={selectedCategory}
          visibleProducts={products.length}
          totalProducts={pagination.totalProducts}
        />

        {/* Filters */}
        <section className="mb-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 via-white to-sky-50/80 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <SlidersHorizontal className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Browse Products</h2>

              <p className="text-xs text-slate-500">
                Filter by category and change the product order
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1 overflow-x-auto pb-1">
              <CategoryFilter categories={categories} />
            </div>

            <div className="border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              <SortDropdown />
            </div>
          </div>
        </section>

        {products.length > 0 ? (
          <>
            <section
              aria-label="Product results"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-100/70"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </section>

            {pagination.totalPages > 1 && (
              <div className="mt-16 flex justify-center border-t border-slate-200 pt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  searchParams={{
                    search,
                    category,
                    sort: normalizeSort(sort),
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <ProductsEmptyState />
        )}
      </div>
    </main>
  );
}

function buildProductQuery({
  search,
  category,
  sort,
  page,
}: ProductQueryInput) {
  const query = new URLSearchParams();

  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    query.set("search", normalizedSearch);
  }

  /*
  The browser uses `category`, while the API
  expects `categoryId`.
  */
  if (category && isValidObjectId(category)) {
    query.set("categoryId", category);
  }

  query.set("sort", normalizeSort(sort));

  query.set("page", normalizePage(page));

  query.set("limit", String(PRODUCTS_PER_PAGE));

  return query;
}

function normalizeSort(sort?: string): ProductSortOption {
  if (sort && allowedSortValues.includes(sort as ProductSortOption)) {
    return sort as ProductSortOption;
  }

  return "newest";
}

function normalizePage(page?: string): string {
  const pageNumber = Number(page);

  if (Number.isInteger(pageNumber) && pageNumber > 0) {
    return String(pageNumber);
  }

  return "1";
}

function isValidObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function ProductsHeader({
  search,
  selectedCategory,
  visibleProducts,
  totalProducts,
}: ProductsHeaderProps) {
  let title = "Explore Our Products";

  if (search) {
    title = `Search results for “${search}”`;
  } else if (selectedCategory) {
    title = selectedCategory.name;
  }

  return (
    <header className="relative mb-10 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-6 py-9 text-white shadow-xl shadow-emerald-200/60 sm:px-9">
      <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10" />

      <div className="absolute -bottom-20 right-32 h-44 w-44 rounded-full bg-white/10" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-emerald-100">
          <Sparkles className="h-4 w-4" />

          <span className="text-xs font-bold uppercase tracking-[0.2em]">
            NovaShop Collection
          </span>
        </div>

        <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {selectedCategory?.description && !search ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
            {selectedCategory.description}
          </p>
        ) : (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
            Discover quality products selected for your everyday needs.
          </p>
        )}

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
          <Boxes className="h-4 w-4" />
          Showing {visibleProducts} of {totalProducts}{" "}
          {totalProducts === 1 ? "product" : "products"}
        </div>
      </div>
    </header>
  );
}

function ProductsEmptyState() {
  return (
    <section className="mx-auto my-16 max-w-lg rounded-3xl border border-slate-200 bg-white/90 px-7 py-12 text-center shadow-xl shadow-slate-200/60 backdrop-blur">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600">
        <PackageSearch className="h-9 w-9" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        No Products Found
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        We could not find products matching your current search and filters.
      </p>

      <Link
        href="/products"
        className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700"
      >
        Clear All Filters
      </Link>
    </section>
  );
}
