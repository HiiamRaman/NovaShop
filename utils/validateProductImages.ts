import { ApiError } from "./ApiError";
const MAX_IMAGE_COUNT = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; //5mb
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export function validateProductImages(entries: FormDataEntryValue[]): File[] {
  if (entries.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  if (entries.length > MAX_IMAGE_COUNT) {
    throw new ApiError(
      400,
      `A product can have a maximum of ${MAX_IMAGE_COUNT} images`
    );
  }

  const files: File[] = [];

  for (const entry of entries) {
    if (!(entry instanceof File)) {
      throw new ApiError(400, "Invalid product image data");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(entry.type)) {
      throw new ApiError(
        400,
        `${entry.name} must be a JPEG, PNG, or WebP image`
      );
    }

    if (entry.size === 0) {
      throw new ApiError(400, `${entry.name} is empty`);
    }

    if (entry.size > MAX_IMAGE_SIZE) {
      throw new ApiError(400, `${entry.name} cannot exceed 5 MB`);
    }

    files.push(entry);
  }

  return files;
}
