import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { updateProductSchema } from "@/schemas/productSchema";
import {
  editProduct,
  getAdminProductById,
  removeProduct,
} from "@/services/product.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

/*
GET /api/admin/products/[productId]

Load one product for the admin edit page.
*/
export const GET = asyncHandler(
  async (request: NextRequest, context: RouteContext): Promise<Response> => {
    const auth = requireAuth(request);
    requireAdmin(auth);

    await connectDB();

    const { productId } = await context.params;

    const product = await getAdminProductById(productId);

    return NextResponse.json(
      new ApiResponse(200, "Admin product fetched successfully", product),
      {
        status: 200,
      }
    );
  }
);

/*
PATCH /api/admin/products/[productId]

Update the product's editable fields.
*/
export const PATCH = asyncHandler(
  async (request: NextRequest, context: RouteContext): Promise<Response> => {
    const auth = requireAuth(request);
    requireAdmin(auth);

    await connectDB();

    const { productId } = await context.params;

    const body: unknown = await request.json();

    const validatedData = updateProductSchema.parse(body);

    const product = await editProduct(productId, validatedData);

    return NextResponse.json(
      new ApiResponse(200, "Product updated successfully", product),
      {
        status: 200,
      }
    );
  }
);

/*
DELETE /api/admin/products/[productId]

Soft-delete the selected product.
*/
export const DELETE = asyncHandler(
  async (request: NextRequest, context: RouteContext): Promise<Response> => {
    const auth = requireAuth(request);
    requireAdmin(auth);

    await connectDB();

    const { productId } = await context.params;

    const product = await removeProduct(productId);

    return NextResponse.json(
      new ApiResponse(200, "Product deleted successfully", product),
      {
        status: 200,
      }
    );
  }
);
