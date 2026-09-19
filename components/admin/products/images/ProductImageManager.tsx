"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

import type { ProductImageData } from "@/types/products.types";

interface ProductImageManagerProps {
  productId: string;
  images: ProductImageData[];

  onImagesUpdated: (images: ProductImageData[]) => void;
}

interface ImageResponse {
  id: string;
  images: ProductImageData[];
}

const MAX_IMAGES = 5;

export default function ProductImageManager({
  productId,
  images,
  onImagesUpdated,
}: ProductImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [deletingPublicId, setDeletingPublicId] = useState<string | null>(null);

  const [isReordering, setIsReordering] = useState(false);

  const sortedImages = images.slice().sort((first, second) => {
    return first.position - second.position;
  });

  const remainingImageCount = MAX_IMAGES - images.length;

  async function handleAddImages(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedImages = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (selectedImages.length === 0) {
      return;
    }

    if (selectedImages.length > remainingImageCount) {
      toast.error(
        `You can add only ${remainingImageCount} more image${
          remainingImageCount === 1 ? "" : "s"
        }`
      );

      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();

      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await api.patch(
        `/api/admin/products/${productId}/images`,
        formData
      );

      const updatedProduct = response.data as ImageResponse;

      onImagesUpdated(updatedProduct.images);

      toast.success("Product images uploaded");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload images";

      toast.error("Upload failed", {
        description: message,
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteImage(image: ProductImageData) {
    const shouldDelete = window.confirm("Remove this product image?");

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingPublicId(image.publicId);

      const response = await api.delete(
        `/api/admin/products/${productId}/images`,
        {
          publicId: image.publicId,
        }
      );

      const updatedProduct = response.data as ImageResponse;

      onImagesUpdated(updatedProduct.images);

      toast.success("Product image removed");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to remove image";

      toast.error("Delete failed", {
        description: message,
      });
    } finally {
      setDeletingPublicId(null);
    }
  }

  async function handleMoveImage(
    currentIndex: number,
    direction: "left" | "right"
  ) {
    const destinationIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (destinationIndex < 0 || destinationIndex >= sortedImages.length) {
      return;
    }

    const reorderedImages = sortedImages.slice();

    const currentImage = reorderedImages[currentIndex];

    reorderedImages[currentIndex] = reorderedImages[destinationIndex];

    reorderedImages[destinationIndex] = currentImage;

    const publicIds = reorderedImages.map((image) => image.publicId);

    try {
      setIsReordering(true);

      const response = await api.patch(
        `/api/admin/products/${productId}/reorder`,
        {
          publicIds,
        }
      );

      const updatedProduct = response.data as ImageResponse;

      onImagesUpdated(updatedProduct.images);

      toast.success("Image order updated");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reorder images";

      toast.error("Reorder failed", {
        description: message,
      });
    } finally {
      setIsReordering(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Product Images</h2>

          <p className="mt-1 text-sm text-slate-500">
            {images.length} of {MAX_IMAGES} images uploaded
          </p>
        </div>

        <button
          type="button"
          disabled={isUploading || remainingImageCount === 0}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}

          {isUploading ? "Uploading..." : "Add Images"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleAddImages}
          className="hidden"
        />
      </div>

      {sortedImages.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sortedImages.map((image, index) => {
            const isDeleting = deletingPublicId === image.publicId;

            return (
              <article
                key={image.publicId}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <Image
                    src={image.url}
                    alt={image.alt || `Product image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                      Main Image
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={index === 0 || isReordering}
                      onClick={() => handleMoveImage(index, "left")}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Move image left"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      disabled={
                        index === sortedImages.length - 1 || isReordering
                      }
                      onClick={() => handleMoveImage(index, "right")}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Move image right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleDeleteImage(image)}
                    className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Delete product image"
                  >
                    {isDeleting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 py-14 text-center">
          <ImagePlus className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm font-semibold text-slate-500">
            No product images
          </p>
        </div>
      )}

      {isReordering && (
        <p className="mt-4 flex items-center gap-2 text-sm text-indigo-600">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Saving image order...
        </p>
      )}
    </section>
  );
}
