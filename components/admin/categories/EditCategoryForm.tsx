"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { LoaderCircle, Save, X } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

import type { AdminCategory } from "@/types/category.types";

interface EditCategoryFormProps {
  category: AdminCategory;
  onCategoryUpdated: (category: AdminCategory) => void;
  onCancel: () => void;
}

export default function EditCategoryForm({
  category,
  onCategoryUpdated,
  onCancel,
}: EditCategoryFormProps) {
  const [name, setName] = useState(category.name);

  const [description, setDescription] = useState(category.description);

  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedName = name.trim();
    const updatedDescription = description.trim();

    if (!updatedName) {
      toast.error("Category name is required");
      return;
    }

    if (!updatedDescription) {
      toast.error("Category description is required");
      return;
    }

    try {
      setIsSaving(true);

      const response = await api.patch(`/api/admin/categories/${category.id}`, {
        name: updatedName,
        description: updatedDescription,
      });

      const updatedCategory = response.data as AdminCategory;

      onCategoryUpdated(updatedCategory);

      toast.success("Category updated successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update category";

      toast.error("Unable to update category", {
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-indigo-200 bg-indigo-50/40 p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Edit Category</h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the category name and description.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-xl bg-white p-2 text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
          aria-label="Close edit form"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="edit-category-name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Category name
          </label>

          <input
            id="edit-category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSaving}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="edit-category-description"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Description
          </label>

          <textarea
            id="edit-category-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            disabled={isSaving}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
