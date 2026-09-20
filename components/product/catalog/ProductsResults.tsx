import { Boxes } from "lucide-react";

import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/productCard";
import SortDropdown from "@/components/product/SortDropdown";

import ProductsEmptyState from "./ProductsEmptyState";

import { normalizeProductSort } from "@/utils/productQuery";

import type { PublicCategory } from "@/types/category.types";
import type {
  Product,
  ProductPagination,
} from "@/types/products.types";

interface ProductsResultsProps {
  products: Product[];
  pagination: ProductPagination;
  selectedCategory?: PublicCategory;
  search?: string;
  category?: string;
  sort?: string;
}

export default function ProductsResults({
  products,
  pagination,
  selectedCategory,
  search,
  category,
  sort,
}: ProductsResultsProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/70 via-white to-sky-50/70 px-5 py-5 sm:px-7 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-700">
            <Boxes className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              {selectedCategory
                ? selectedCategory.name
                : "Shop All"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Showing {products.length} of{" "}
              {pagination.totalProducts}{" "}
              {pagination.totalProducts === 1
                ? "product"
                : "products"}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <SortDropdown />
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="h-full rounded-2xl bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-100/80"
                >
                  <ProductCard
                    product={product}
                  />
                </div>
              ))}
            </div>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center border-t border-slate-100 bg-slate-50/70 px-5 py-7">
              <Pagination
                currentPage={
                  pagination.currentPage
                }
                totalPages={
                  pagination.totalPages
                }
                searchParams={{
                  search,
                  category,
                  sort: normalizeProductSort(
                    sort
                  ),
                }}
              />
            </div>
          )}
        </>
      ) : (
        <ProductsEmptyState />
      )}
    </section>
  );
}
