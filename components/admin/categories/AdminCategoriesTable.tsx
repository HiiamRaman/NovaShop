"use client";

import { FolderTree } from "lucide-react";

import AdminCategoryRow from "./AdminCategoryRow";

import type { AdminCategory } from "@/types/category.types";

interface AdminCategoriesTableProps {
  categories: AdminCategory[];
  isLoading: boolean;
  changingStatusId: string | null;
  onEdit: (category: AdminCategory) => void;
  onStatusChange: (category: AdminCategory) => void;
}

export default function AdminCategoriesTable({
  categories,
  isLoading,
  changingStatusId,
  onEdit,
  onStatusChange,
}: AdminCategoriesTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-16 text-center">
        <FolderTree className="mx-auto h-10 w-10 text-slate-300" />

        <h3 className="mt-4 font-bold text-slate-800">No categories found</h3>

        <p className="mt-1 text-sm text-slate-500">
          Add a category or change your search.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {categories.map((category) => (
        <AdminCategoryRow
          key={category.id}
          category={category}
          isChangingStatus={changingStatusId === category.id}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
