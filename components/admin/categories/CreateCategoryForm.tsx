"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

import type { AdminCategory } from "@/types/category.types";

interface CreateCategoryFormProps {
  onCategoryCreated: (category: AdminCategory) => void;
}

export default function CreateCategoryForm({
  onCategoryCreated,
}: CreateCategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const categoryName = name.trim();
    const categoryDescription = description.trim();

    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    if (!categoryDescription) {
      toast.error("Category description is required");
      return;
    }

    try {
      setIsCreating(true);

      const response = await api.post("/api/admin/categories", {
        name: categoryName,
        description: categoryDescription,
      });

      const createdCategory = response.data as AdminCategory;

      onCategoryCreated(createdCategory);

      setName("");
      setDescription("");

      toast.success("Category created successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create category";

      toast.error("Unable to create category", {
        description: message,
      });
    } finally {
      setIsCreating(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Plus className="h-6 w-6" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900">Add Category</h2>

      <p className="mt-1 text-sm text-slate-500">
        Create a category for your products.
      </p>

      <div className="mt-6">
        <label
          htmlFor="category-name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Category name
        </label>

        <input
          id="category-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="For example: Smartphones"
          disabled={isCreating}
          className={inputClass}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="category-description"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Description
        </label>

        <textarea
          id="category-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe this category"
          rows={4}
          disabled={isCreating}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isCreating}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCreating ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}

        {isCreating ? "Creating..." : "Add Category"}
      </button>
    </form>
  );
}
