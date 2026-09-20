"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

import AdminCategoriesHeader from "./AdminCategoriesHeader";
import AdminCategoriesTable from "./AdminCategoriesTable";
import AdminCategoriesToolbar from "./AdminCategoriesToolbar";
import CreateCategoryForm from "./CreateCategoryForm";
import EditCategoryForm from "./EditCategoryForm";

import type { AdminCategory } from "@/types/category.types";

export default function AdminCategoriesContent() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const [search, setSearch] = useState("");

  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(
    null
  );

  const [changingStatusId, setChangingStatusId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/api/admin/categories");

        const data = response.data as AdminCategory[];

        setCategories(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load categories";

        toast.error("Unable to load categories", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(searchValue) ||
        category.slug.toLowerCase().includes(searchValue) ||
        category.description.toLowerCase().includes(searchValue)
      );
    });
  }, [categories, search]);

  function handleCategoryCreated(category: AdminCategory) {
    setCategories((currentCategories) => [category, ...currentCategories]);
  }

  function handleCategoryUpdated(updatedCategory: AdminCategory) {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === updatedCategory.id
          ? {
              ...category,
              ...updatedCategory,
            }
          : category
      )
    );

    setEditingCategory(null);
  }

  async function handleStatusChange(category: AdminCategory) {
    const nextStatus = !category.isActive;

    try {
      setChangingStatusId(category.id);

      const response = await api.patch(
        `/api/admin/categories/${category.id}/status`,
        {
          isActive: nextStatus,
        }
      );

      const updatedCategory = response.data as AdminCategory;

      setCategories((currentCategories) =>
        currentCategories.map((currentCategory) =>
          currentCategory.id === updatedCategory.id
            ? {
                ...currentCategory,
                ...updatedCategory,
              }
            : currentCategory
        )
      );

      toast.success(nextStatus ? "Category activated" : "Category deactivated");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update category status";

      toast.error("Unable to update category status", {
        description: message,
      });
    } finally {
      setChangingStatusId(null);
    }
  }

  return (
    <section className="space-y-6">
      <AdminCategoriesHeader />

      {editingCategory && (
        <EditCategoryForm
          key={editingCategory.id}
          category={editingCategory}
          onCategoryUpdated={handleCategoryUpdated}
          onCancel={() => setEditingCategory(null)}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <CreateCategoryForm onCategoryCreated={handleCategoryCreated} />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <AdminCategoriesToolbar
            search={search}
            categoryCount={filteredCategories.length}
            onSearchChange={setSearch}
          />

          <AdminCategoriesTable
            categories={filteredCategories}
            isLoading={isLoading}
            changingStatusId={changingStatusId}
            onEdit={setEditingCategory}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </section>
  );
}
