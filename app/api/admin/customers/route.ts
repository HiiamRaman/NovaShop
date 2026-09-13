import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAllCustomersForAdmin } from "@/services/auth.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";

export const GET = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    const auth = requireAuth(request);
    requireAdmin(auth);

    await connectDB();

    const customers = await getAllCustomersForAdmin();

    return NextResponse.json(
      new ApiResponse(
        200,
        "Customers fetched successfully",
        customers
      ),
      {
        status: 200,
      }
    );
  }
);
