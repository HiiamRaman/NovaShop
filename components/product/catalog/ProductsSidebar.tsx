import Link from "next/link";
import {
  SlidersHorizontal,
} from "lucide-react";

import CategoryFilter from "@/components/product/categoryFilter";

import type { PublicCategory } from "@/types/category.types";

interface ProductsSidebarProps {
  categories: PublicCategory[];
  search?: string;
  category?: string;
  sort?: string;
}

export default function ProductsSidebar({
  categories,
  search,
  category,
  sort,
}: ProductsSidebarProps) {
  const hasFilters = Boolean(
    search || category || sort
  );

  return (
    <aside className="border-b border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl lg:sticky lg:top-20 lg:min-h-[calc(100vh-5rem)] lg:border-b-0">
      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-sky-50 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <SlidersHorizontal className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Shop By
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Select a category
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Categories
        </p>

        <CategoryFilter
          categories={categories}
          layout="sidebar"
        />

        {hasFilters && (
          <>
            <div className="my-5 h-px bg-slate-100" />

            <Link
              href="/products"
              className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Clear All Filters
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
