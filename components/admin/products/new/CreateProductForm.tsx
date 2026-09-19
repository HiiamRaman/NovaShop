"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ImagePlus, LoaderCircle, PackagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

import type { CreateProductInput } from "@/schemas/productSchema";
import type { ProductCategoryOption } from "./NewProductContent";

interface CreateProductFormProps {
  categories: ProductCategoryOption[];
}

const MAX_IMAGES = 5;

export default function CreateProductForm({
  categories,
}: CreateProductFormProps) {
  const router = useRouter();

  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      categoryId: categories[0]?.id ?? "",
      sku: "",
      priceInMinorUnit: 0,
      currency: "NPR",
    },
  });

  function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      toast.error(`A product can have a maximum of ${MAX_IMAGES} images`);

      event.target.value = "";
      return;
    }

    setImages((currentImages) => [...currentImages, ...selectedFiles]);

    // Allow the same file to be selected again after removal.
    event.target.value = "";
  }

  function removeSelectedImage(imageIndex: number) {
    setImages((currentImages) =>
      currentImages.filter((_, index) => index !== imageIndex)
    );
  }

  async function onSubmit(data: CreateProductInput) {
    if (images.length === 0) {
      toast.error("Select at least one product image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", data.name);

      formData.append("description", data.description);

      formData.append("brand", data.brand);

      formData.append("categoryId", data.categoryId);

      formData.append("sku", data.sku);

      formData.append("priceInMinorUnit", String(data.priceInMinorUnit));

      formData.append("currency", data.currency);

      images.forEach((image) => {
        formData.append("images", image);
      });

      await api.post("/api/admin/products", formData);

      toast.success("Product created successfully");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create product";

      toast.error("Creation failed", {
        description: message,
      });
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Product Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <FormField label="Product name" error={errors.name?.message}>
            <input
              {...register("name", {
                required: "Product name is required",
                minLength: {
                  value: 2,
                  message: "Name must contain at least 2 characters",
                },
              })}
              placeholder="Samsung Galaxy S25"
              className={inputClass}
            />
          </FormField>

          <FormField label="Brand" error={errors.brand?.message}>
            <input
              {...register("brand", {
                required: "Brand is required",
                minLength: {
                  value: 2,
                  message: "Brand must contain at least 2 characters",
                },
              })}
              placeholder="Samsung"
              className={inputClass}
            />
          </FormField>

          <FormField label="SKU" error={errors.sku?.message}>
            <input
              {...register("sku", {
                required: "SKU is required",
              })}
              placeholder="SAMSUNG-S25-256"
              className={inputClass}
            />
          </FormField>

          <FormField label="Category" error={errors.categoryId?.message}>
            <select
              {...register("categoryId", {
                required: "Category is required",
              })}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
                required: "Price is required",
                min: {
                  value: 0,
                  message: "Price cannot be negative",
                },
              })}
              placeholder="14500000"
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
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must contain at least 10 characters",
                  },
                })}
                rows={5}
                placeholder="Describe the product..."
                className={inputClass}
              />
            </FormField>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Product Images</h2>

        <p className="mt-1 text-sm text-slate-500">
          Upload between 1 and {MAX_IMAGES} images.
        </p>

        <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-sm font-semibold text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600">
          <ImagePlus className="h-5 w-5" />
          Select Images
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageSelection}
            className="hidden"
          />
        </label>

        {images.length > 0 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {image.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeSelectedImage(index)}
                  className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                  aria-label={`Remove ${image.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <PackagePlus className="h-4 w-4" />
          )}

          {isSubmitting ? "Creating..." : "Create Product"}
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
