import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { reorderProductImagesSchema } from "@/schemas/productSchema";
import { reorderProductImages } from "@/services/product.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";

/*
PATCH /api/admin/products/:productId/images/reorder

1. Authenticate the admin
2. Read productId from the URL
3. Read and validate publicIds
4. Reorder images through the service
5. Return the updated images
*/
export const PATCH = asyncHandler(
  async (
    request: NextRequest,
    context: {
      params: Promise<{ productId: string }>;
    }
  ): Promise<Response> => {
    await connectDB();

    const user = requireAuth(request);

    if (user.role !== "admin") {
      throw new ApiError(403, "Admin access required");
    }

    const { productId } = await context.params;

    // Only one await is required.
    const body: unknown = await request.json();

    const { publicIds } =
      reorderProductImagesSchema.parse(body);

    const product = await reorderProductImages(
      productId,
      publicIds
    );

    return NextResponse.json(
      new ApiResponse(
        200,
        "Product images reordered successfully",
        product
      ),
      { status: 200 }
    );
  }
);
