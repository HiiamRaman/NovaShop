import { asyncHandler } from "@/utils/asyncHandler";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import { ApiResponse } from "@/utils/ApiResponse";
import { getActiveCategories } from "@/services/category.service";
export const GET = asyncHandler(async (): Promise<Response> => {
  await connectDB();
  const categories = await getActiveCategories();
  return NextResponse.json(
    new ApiResponse(
      200,
      "Active Categories  fetched successfully",
      categories
    ),
    {
      status: 200,
    }
  );
});
