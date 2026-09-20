import {
  Boxes,
  Sparkles,
} from "lucide-react";

import type { PublicCategory } from "@/types/category.types";

interface ProductsHeaderProps {
  search?: string;
  selectedCategory?: PublicCategory;
  visibleProducts: number;
  totalProducts: number;
}

export default function ProductsHeader({
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

  const description =
    selectedCategory?.description &&
    !search
      ? selectedCategory.description
      : "Discover quality products selected for your everyday needs.";

  return (
    <header className="relative mb-6 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-5 text-white shadow-lg shadow-emerald-200/50 sm:px-6">
      <div className="absolute -right-10 -top-14 h-32 w-32 rounded-full bg-white/10" />

      <div className="absolute -bottom-16 right-28 h-28 w-28 rounded-full bg-white/10" />

      <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-emerald-100">
            <Sparkles className="h-3.5 w-3.5" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
              NovaShop Collection
            </span>
          </div>

          <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-emerald-50 sm:text-sm">
            {description}
          </p>
        </div>

        <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-2.5 backdrop-blur">
          <Boxes className="h-4 w-4" />

          <span className="text-sm font-semibold">
            {visibleProducts} of{" "}
            {totalProducts}{" "}
            {totalProducts === 1
              ? "product"
              : "products"}
          </span>
        </div>
      </div>
    </header>
  );
}
