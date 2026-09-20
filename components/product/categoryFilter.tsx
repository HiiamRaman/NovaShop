"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid } from "lucide-react";

import { PublicCategory } from "@/types/category.types";

interface CategoryFilterProps {
  categories: PublicCategory[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
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

    // Return to page one whenever the filter changes.
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => handleCategory()}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
          !activeCategory
            ? "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200"
            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        All
      </button>

      {categories.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategory(category.id)}
            title={category.description}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
              isActive
                ? "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
