"use client";

import {
  Edit3,
  LoaderCircle,
  Tags,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import type { AdminCategory } from "@/types/category.types";

interface AdminCategoryRowProps {
  category: AdminCategory;
  isChangingStatus: boolean;
  onEdit: (category: AdminCategory) => void;
  onStatusChange: (category: AdminCategory) => void;
}

export default function AdminCategoryRow({
  category,
  isChangingStatus,
  onEdit,
  onStatusChange,
}: AdminCategoryRowProps) {
  return (
    <article className="flex flex-col gap-4 p-5 transition hover:bg-emerald-50/40 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Tags className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-bold text-slate-800">
              {category.name}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                category.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-slate-400">
            /{category.slug}
          </p>

          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {category.description}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
        >
          <Edit3 className="h-4 w-4" />
          Edit
        </button>

        <button
          type="button"
          disabled={isChangingStatus}
          onClick={() => onStatusChange(category)}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            category.isActive
              ? "bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
          }`}
        >
          {isChangingStatus ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : category.isActive ? (
            <ToggleRight className="h-4 w-4" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}

          {category.isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
    </article>
  );
}
