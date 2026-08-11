import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";
import { UpdateCategoryStatusSchema } from "@/schemas/categorySchema";
import { changeCategoryStatus } from "@/services/category.service";

interface RouteContext {
  params: Promise<{
    categoryId: string;
  }>;
}
export const PATCH = asyncHandler(
  async (req: NextRequest, context: RouteContext): Promise<Response> => {
    //connect db
    await connectDB();
    //only authentivated admin can change active status

    const auth = requireAuth(req);
    //check for admin
    requireAdmin(auth);

    const { categoryId } = await context.params;
    //read and validate the new status

    const body: unknown = await req.json();

    const validatedData = UpdateCategoryStatusSchema.parse(body);

    //upate the category status

    const category = await changeCategoryStatus(categoryId, validatedData);

    return NextResponse.json(
      new ApiResponse(200, "Category status updated successfully", category),
      {
        status: 200,
      }
    );
  }
);
