import { NextRequest, NextResponse } from "next/server";
import { ProductImageData } from "@/types/products.types";
import { connectDB } from "@/lib/mongodb";
import { deleteProductImages, uploadProductImages } from "@/lib/uploadImage";

import {
  createProductSchema,
  productListQuerySchema,
} from "@/schemas/productSchema";
import { addProduct, getAdminProducts } from "@/services/product.service";
import { validateProductImages } from "@/utils/validateProductImages";
import { requireAuth } from "@/utils/requireAuth";
import { requireAdmin } from "@/utils/requireAdmin";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

// Cloudinary upload uses Node.js APIs such as Buffer
export const runtime = "nodejs";

export const POST = asyncHandler(
  async (req: NextRequest): Promise<Response> => {
    // Verify the requester before processing expensive uploads
    const auth = requireAuth(req);
    requireAdmin(auth);
    await connectDB();
    const formData = await req.formData();
    // Extract product text fields from FormData
    const productInput = {
      name: formData.get("name"),
      description: formData.get("description"),
      brand: formData.get("brand"),
      categoryId: formData.get("categoryId"),
      sku: formData.get("sku"),
      priceInMinorUnit: formData.get("priceInMinorUnit"),
      currency: formData.get("currency"),
    };

    const validatedData = createProductSchema.parse(productInput);
    // Extract and validate all uploaded images

    const imageEnteries = formData.getAll("images");
    const imageFiles = validateProductImages(imageEnteries);
    let uploadedImages: ProductImageData[] = [];
    try {
      uploadedImages = await uploadProductImages(imageFiles);
      const product = await addProduct(validatedData, uploadedImages, auth.sub);
      return NextResponse.json(
        new ApiResponse(201, "Product created successfully", product),
        {
          status: 201,
        }
      );
    } catch (error) {
      if (uploadedImages.length > 0) {
        try {
          await deleteProductImages(uploadedImages);
        } catch (cleanupError) {
          console.error("Failed to clean up Cloudinary images:", cleanupError);
        }
      }
      throw error;
    }
  }
);

export const GET = asyncHandler(async (req: NextRequest): Promise<Response> => {
  // Verify authentication and admin authorization
  const auth = requireAuth(req);
  requireAdmin(auth);

  await connectDB();
  // Convert URLSearchParams into a normal object
  const queryParams = Object.fromEntries(req.nextUrl.searchParams);
  // Validate and convert page/limit into numbers
  const validatedQuery = productListQuerySchema.parse(queryParams);
  const result = await getAdminProducts(validatedQuery);
  return NextResponse.json(
    new ApiResponse(200, "Products fetched successfully", result),
    {
      status: 200,
    }
  );
});
