"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const sortOptions = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Price: Low to High",
    value: "price-low-to-high",
  },
  {
    label: "Price: High to Low",
    value: "price-high-to-low",
  },
  {
    label: "Name: A to Z",
    value: "name-a-to-z",
  },
];

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSort = searchParams.get("sort") || "newest";

  function handleSort(sortValue: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", sortValue);

    // Sorting can change the number and order of pages.
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <ArrowUpDown className="h-4 w-4" />
      </div>

      <div>
        <label
          htmlFor="product-sort"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400"
        >
          Sort products
        </label>

        <select
          id="product-sort"
          value={activeSort}
          onChange={(event) => handleSort(event.target.value)}
          className="min-w-48 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
