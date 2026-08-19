import { restoreProduct } from "@/services/product.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";
import { requireAdmin } from "@/utils/requireAdmin";
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/utils/ApiError";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export const PATCH = asyncHandler(
  async (req: NextRequest, context: RouteContext): Promise<Response> => {
    const auth = requireAuth(req);
    requireAdmin(auth);
    await connectDB();

    const { productId } = await context.params;

    const product = await restoreProduct(productId);
    if (!product) {
      throw new ApiError(404, "product not found");
    }
    return NextResponse.json(
      new ApiResponse(200, "Product restored successfully", product),
      {
        status: 200,
      }
    );
  }
);
