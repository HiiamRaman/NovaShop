"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  FolderTree,
  Plus,
  Search,
  Tags,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/api/admin/categories");
        const data = response.data as AdminCategory[];

        setCategories(data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load categories";

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

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchValue) ||
        category.slug.toLowerCase().includes(searchValue)
    );
  }, [categories, search]);

  async function handleAddCategory(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const name = categoryName.trim();
    const description = categoryDescription.trim();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    if (!description) {
      toast.error("Category description is required");
      return;
    }

    try {
      setIsCreating(true);

      const response = await api.post("/api/admin/categories", {
        name,
        description,
      });

      const createdCategory = response.data as AdminCategory;

      setCategories((currentCategories) => [
        createdCategory,
        ...currentCategories,
      ]);

      setCategoryName("");
      setCategoryDescription("");

      toast.success("Category created successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create category";

      toast.error("Unable to create category", {
        description: message,
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteCategory(
    categoryId: string,
    categoryName: string
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${categoryName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(categoryId);

      await api.delete(`/api/admin/categories/${categoryId}`);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => category.id !== categoryId
        )
      );

      toast.success("Category deleted successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete category";

      toast.error("Unable to delete category", {
        description: message,
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 p-7 text-white shadow-xl shadow-emerald-200">
        <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-40 h-44 w-44 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-50">
            <FolderTree className="h-5 w-5" />

            <span className="text-sm font-medium">
              Category Management
            </span>
          </div>

          <h2 className="mt-2 text-3xl font-bold">
            Categories
          </h2>

          <p className="mt-2 text-sm text-emerald-50">
            Organize products into clear shopping categories.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        {/* Add category form */}
        <form
          onSubmit={handleAddCategory}
          className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Plus className="h-6 w-6" />
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-900">
            Add Category
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create a category for your products.
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category name
            </label>

            <input
              value={categoryName}
              onChange={(event) =>
                setCategoryName(event.target.value)
              }
              placeholder="For example: Smartphones"
              disabled={isCreating}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={categoryDescription}
              onChange={(event) =>
                setCategoryDescription(event.target.value)
              }
              placeholder="Describe this category"
              rows={4}
              disabled={isCreating}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />

            {isCreating ? "Creating..." : "Add Category"}
          </button>
        </form>

        {/* Category list */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search categories..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              {filteredCategories.length} categories
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredCategories.map((category) => (
                <article
                  key={category.id}
                  className="flex items-center justify-between gap-4 p-5 transition hover:bg-emerald-50/40"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Tags className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-800">
                        {category.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        /{category.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden max-w-60 text-right sm:block">
                      <p className="truncate text-sm text-slate-600">
                        {category.description}
                      </p>

                      <p
                        className={`mt-1 text-xs font-semibold ${
                          category.isActive
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {category.isActive
                          ? "Active"
                          : "Inactive"}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === category.id}
                      onClick={() =>
                        handleDeleteCategory(
                          category.id,
                          category.name
                        )
                      }
                      className="rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!isLoading && filteredCategories.length === 0 && (
            <div className="py-16 text-center">
              <FolderTree className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 font-bold text-slate-800">
                No categories found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add a category or change your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
