import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { getPublicProductBySlug } from "@/services/product.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export const GET = asyncHandler(
  async (req: NextRequest, context: RouteContext): Promise<Response> => {
    await connectDB();
    const { slug } = await context.params;

    const product = await getPublicProductBySlug(slug);

    return NextResponse.json(
      new ApiResponse(200, "Product fetched successfully", product),
      {
        status: 200,
      }
    );
  }
);
