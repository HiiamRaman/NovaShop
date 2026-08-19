import { connectDB } from "@/lib/mongodb";
import { updateProductStockSchema } from "@/schemas/productSchema";
import { changeProductstock } from "@/services/product.service";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export interface RouteContext {
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
    const body: unknown = await req.json();

    const validatedData = updateProductStockSchema.parse(body);

    const product = await changeProductstock(productId, validatedData);

    return NextResponse.json(
      new ApiResponse(200, "Product stock updated successfully", product),{
        status:200
      }
    );
  }
);
