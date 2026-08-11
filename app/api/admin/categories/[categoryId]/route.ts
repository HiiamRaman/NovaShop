import { connectDB } from "@/lib/mongodb";
import { updateCategorySchema } from "@/schemas/categorySchema";
import { editCategory } from "@/services/category.service";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/utils/ApiResponse";

import { asyncHandler } from "@/utils/asyncHandler";

interface RouterContext {
  params: Promise<{
    categoryId: string;
  }>;
}

export const PATCH = asyncHandler(
  async (req: NextRequest, context: RouterContext): Promise<Response> => {
    await connectDB();
    //only admin can edit categories
    const auth = requireAuth(req);
    //get admin
    requireAdmin(auth);
    //extract category id from url
    const { categoryId } = await context.params;

    //validate the fields proviided for editing
    const body = await req.json();
    const validatedData = updateCategorySchema.parse(body);

    //update category details
    const category = await editCategory(categoryId, validatedData);

    return NextResponse.json(
      new ApiResponse(200, "Category updated successfully", category),
      {
        status: 200,
      }
    );
  }
);
