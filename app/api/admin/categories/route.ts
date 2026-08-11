import { connectDB } from "@/lib/mongodb";
import { createCategorySchema } from "@/schemas/categorySchema";
import { addCategory, getAllCategories } from "@/services/category.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";

import { NextResponse, NextRequest } from "next/server";
//create a category
export const POST = asyncHandler(
  async (req: NextRequest): Promise<Response> => {
    await connectDB();
    const auth = requireAuth(req);
    //only admiin can create category
    requireAdmin(auth);
    //read thebody
    const body: unknown = await req.json();
    //validate
    const validatedData = createCategorySchema.parse(body);

    //add catgeory
    const category = await addCategory(validatedData);
    return NextResponse.json(
      new ApiResponse(201, "Category created successfully", category),
      {
        status: 201,
      }
    );
  }
);
//list all categories
export const GET = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    // Ensure MongoDB is connected
    await connectDB();

    // Verify authentication and admin authorization
    const auth = requireAuth(request);
    requireAdmin(auth);

    // Fetch active and inactive categories
    const categories = await getAllCategories();

    return NextResponse.json(
      new ApiResponse(200, "Categories fetched successfully", categories),
      {
        status: 200,
      }
    );
  }
);
