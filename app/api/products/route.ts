import { connectDB } from "@/lib/mongodb";
import { productListQuerySchema } from "@/schemas/productSchema";
import { getPublicProducts } from "@/services/product.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (req: NextRequest): Promise<Response> => {
  await connectDB();
  // Convert URL query parameters into a normal object

  const queryParams = Object.fromEntries(req.nextUrl.searchParams);
  // Validate pagination values
  const validatedQuery = productListQuerySchema.parse(queryParams);
  const result = await getPublicProducts(validatedQuery);

  return NextResponse.json(
    new ApiResponse(200, "Products fetched successfully", result),
    {
      status: 200,
    }
  );
});
