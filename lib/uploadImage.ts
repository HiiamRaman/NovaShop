import "server-only";

import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "./cloudinary";
import type { ProductImageData } from "@/types/products.types";
export async function uploadImage(file: File): Promise<UploadApiResponse> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "novashop/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary did not return an upload result"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}
export async function uploadProductImages(
  files: File[],
  startingPosition: number = 1
): Promise<ProductImageData[]> {
  const uploadedImages: ProductImageData[] = [];

  try {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const result = await uploadImage(file);
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
        alt: file.name,
        position: startingPosition + index,
      });
    }
    return uploadedImages;
  } catch (error) {
    // Roll back images uploaded before one upload failed
    await deleteProductImages(uploadedImages);
    throw error;
  }
}
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
}

export async function deleteProductImages(
  images: ProductImageData[]
): Promise<void> {
  await Promise.all(images.map((image) => deleteImage(image.publicId)));
}
