import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getCustomerByIdForAdmin } from "@/services/auth.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";

interface RouteContext {
  params: Promise<{
    customerId: string;
  }>;
}

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: {
      params: Promise<{ customerId: string }>;
    }
  ): Promise<Response> => {
    const auth = requireAuth(request);
    requireAdmin(auth);

    await connectDB();

    const { customerId } = await context.params;

    const customer =
      await getCustomerByIdForAdmin(customerId);

    return NextResponse.json(
      new ApiResponse(
        200,
        "Customer fetched successfully",
        customer
      ),
      {
        status: 200,
      }
    );
  }
);
