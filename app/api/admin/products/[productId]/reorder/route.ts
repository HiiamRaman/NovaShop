import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { reorderProductImagesSchema } from "@/schemas/productSchema";
import { reorderProductImages } from "@/services/product.service";
import { NextResponse } from "next/server";
/*
PATCH /api/admin/products/:productId/images

Mental model:
1. Read productId from the URL
2. Read publicIds from the request body
3. Validate the body with Zod
4. Reorder the images through the service
5. Return the updated images
*/

export const PATCH = asyncHandler(
  async (
    req: Request,
    context: {
      params: Promise<{ productId: string }>;
    }
  ) => {
    const { productId } = await context.params;
    const body: unknown = await await req.json();
    const { publicIds } = reorderProductImagesSchema.parse(body);
    const product = await reorderProductImages(productId, publicIds);
    return NextResponse.json(
      new ApiResponse(200, "Product images reordered successfully", product),
      {
        status: 200,
      }
    );
  }
);
