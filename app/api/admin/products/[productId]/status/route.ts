import { connectDB } from "@/lib/mongodb";
import { updateProductStatusSchema } from "@/schemas/productSchema";
import { changeProductStatus } from "@/services/product.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export const PATCH = asyncHandler(
  async (req: NextRequest, context: RouteContext): Promise<Response> => {
    const auth = requireAuth(req);
    requireAdmin(auth);

    connectDB();
    const { productId } = await context.params;

    //validate
    const body: unknown = await req.json();
    const validatedData = updateProductStatusSchema.parse(body);

    const product = await changeProductStatus(productId, validatedData);

    return NextResponse.json(
      new ApiResponse(200, "Product status updated successfully", product),
      {
        status:200
      }
    );
  }
);
