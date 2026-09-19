"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Images, LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "@/lib/apiClient";
import {
  updateProductSchema,
  type updateProductInput,
} from "@/schemas/productSchema";

import type { AdminProduct } from "@/types/products.types";
import type { ProductCategoryOption } from "./EditProductContent";

interface EditProductFormProps {
  product: AdminProduct;
  categories: ProductCategoryOption[];
}

export default function EditProductForm({
  product,
  categories,
}: EditProductFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<updateProductInput>({
    resolver: zodResolver(updateProductSchema),

    defaultValues: {
      name: product.name,
      description: product.description,
      brand: product.brand,
      categoryId: product.categoryId,
      sku: product.sku,
      priceInMinorUnit: product.priceInMinorUnit,
      currency: product.currency,
    },
  });

  async function onSubmit(data: updateProductInput) {
    try {
      await api.patch(`/api/admin/products/${product.id}`, data);

      toast.success("Product updated successfully");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update product";

      toast.error("Update failed", {
        description: message,
      });
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Form header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/70 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Product Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the product&apos;s basic information, category and price.
          </p>
        </div>

        <Link
          href={`/admin/products/${product.id}/images`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-violet-600 hover:bg-violet-600 hover:text-white"
        >
          <Images className="h-4 w-4" />
          Manage Images
        </Link>
      </div>

      {/* Product fields */}
      <div className="grid gap-5 p-6 md:grid-cols-2">
        <FormField label="Product name" error={errors.name?.message}>
          <input {...register("name")} className={inputClass} />
        </FormField>

        <FormField label="Brand" error={errors.brand?.message}>
          <input {...register("brand")} className={inputClass} />
        </FormField>

        <FormField label="SKU" error={errors.sku?.message}>
          <input {...register("sku")} className={inputClass} />
        </FormField>

        <FormField label="Category" error={errors.categoryId?.message}>
          <select {...register("categoryId")} className={inputClass}>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                disabled={!category.isActive}
              >
                {category.name}
                {!category.isActive ? " (inactive)" : ""}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Price in minor unit"
          error={errors.priceInMinorUnit?.message}
        >
          <input
            type="number"
            min={0}
            {...register("priceInMinorUnit", {
              valueAsNumber: true,
            })}
            className={inputClass}
          />

          <p className="mt-1 text-xs font-normal text-slate-400">
            Example: NPR 145,000 is stored as 14500000.
          </p>
        </FormField>

        <FormField label="Currency" error={errors.currency?.message}>
          <select {...register("currency")} className={inputClass}>
            <option value="NPR">NPR</option>

            <option value="USD">USD</option>
          </select>
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={5}
              className={`${inputClass} resize-y`}
            />
          </FormField>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-6 sm:flex-row sm:justify-end">
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}

      {children}

      {error && (
        <span className="mt-1 block text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </label>
  );
}
