"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, Tag } from "lucide-react";

import type { PublicCategory } from "@/types/category.types";

interface CategoryFilterProps {
  categories: PublicCategory[];
  layout?: "horizontal" | "sidebar";
}

export default function CategoryFilter({
  categories,
  layout = "horizontal",
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");

  function handleCategory(categoryId?: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  const isSidebar = layout === "sidebar";

  return (
    <div className={isSidebar ? "space-y-2" : "flex flex-wrap gap-3"}>
      <button
        type="button"
        onClick={() => handleCategory()}
        className={`inline-flex items-center gap-2 border text-sm font-semibold transition ${
          isSidebar
            ? "w-full rounded-xl px-4 py-3 text-left"
            : "rounded-full px-5 py-2.5"
        } ${
          !activeCategory
            ? "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200"
            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        }`}
      >
        <LayoutGrid className="h-4 w-4 shrink-0" />
        All Products
      </button>

      {categories.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategory(category.id)}
            title={category.description}
            className={`inline-flex items-center gap-2 border text-sm font-semibold transition ${
              isSidebar
                ? "w-full rounded-xl px-4 py-3 text-left"
                : "rounded-full px-5 py-2.5"
            } ${
              isActive
                ? "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <Tag className="h-4 w-4 shrink-0" />

            <span className="truncate">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
