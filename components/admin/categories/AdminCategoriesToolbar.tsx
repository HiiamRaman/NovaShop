"use client";

import { Search } from "lucide-react";

interface AdminCategoriesToolbarProps {
  search: string;
  categoryCount: number;
  onSearchChange: (value: string) => void;
}

export default function AdminCategoriesToolbar({
  search,
  categoryCount,
  onSearchChange,
}: AdminCategoriesToolbarProps) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or slug..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        />
      </div>

      <span className="w-fit rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
        {categoryCount} {categoryCount === 1 ? "category" : "categories"}
      </span>
    </div>
  );
}
