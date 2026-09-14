import ProductCard from "@/components/product/productCard";
import CategoryFilter from "@/components/product/categoryFilter";
import SortDropdown from "@/components/product/SortDropdown";
import Pagination from "@/components/product/Pagination";
import { env } from "@/lib/env";
import type {
  Product,
  ProductsResponseData,
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

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { search, category, sort, page } =
    await searchParams;

  const query = new URLSearchParams();

  if (search) {
    query.set("search", search);
  }

  if (category) {
    query.set("categoryId", category);
  }

  if (sort) {
    query.set("sort", sort);
  }

  query.set("page", page || "1");
  query.set("limit", "8");

  const response = await fetch(
    `${env.APP_URL}/api/products?${query.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const result =
    (await response.json()) as ProductsApiResponse;

  const products: Product[] = result.data.products;
  const pagination = result.data.pagination;

  if (products.length === 0) {
    return (
      <div className="mx-auto my-24 max-w-md rounded-2xl bg-white/80 px-6 py-10 text-center shadow-md backdrop-blur-md">
        <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          No Products Found
        </h2>

        <p className="mt-2 text-gray-500">
          Try changing your search, category, or sorting
          option.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl rounded-xl bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-12 shadow-sm sm:px-6 md:py-16 lg:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-gray-200 pb-6">
        <h1 className="relative inline-block text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {search ? (
            <>
              Search results for{" "}
              <span className="text-emerald-600">
                &quot;{search}&quot;
              </span>
            </>
          ) : (
            "Explore Our Products"
          )}

          <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-emerald-200" />
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Showing {products.length} of{" "}
          {pagination.totalProducts} products
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-md md:flex-row md:items-center md:justify-between">
        <div className="flex-grow overflow-x-auto pb-1 md:pb-0">
          <CategoryFilter />
        </div>

        <div className="flex-shrink-0 border-t border-gray-100 pt-4 md:border-t-0 md:pt-0">
          <SortDropdown />
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl transition duration-300 hover:-translate-y-2 hover:shadow-lg"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-16 flex justify-center border-t border-gray-200 pt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            searchParams={{
              search,
              category,
              sort,
            }}
          />
        </div>
      )}
    </main>
  );
}
