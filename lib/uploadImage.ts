import "server-only";

import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "./cloudinary";
import { ProductImageData } from "@/types/products.types";

export async function uploadImage(file: File): Promise<UploadApiResponse> {
  // Convert the Web API File into binary data
  const arrayBuffer = await file.arrayBuffer();

  // Convert ArrayBuffer into a Node.js Buffer
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
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
  files: File[]
): Promise<ProductImageData[]> {
  const uploadedImages: ProductImageData[] = [];

  // Upload each validated file to Cloudinary
  try {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      const result = await uploadImage(file);

      // Store only the Cloudinary information needed by Product
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
        alt: file.name,
        position: index + 1,
      });
    }

    return uploadedImages;
  } catch (error) {
    // Remove images uploaded before the failure
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
