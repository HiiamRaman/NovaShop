import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getOrderByIdForAdmin } from "@/services/order.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";

interface OrderRouteContext {
  params: Promise<{
    orderId: string;
  }>;
}

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: OrderRouteContext
  ): Promise<Response> => {
    const auth = requireAuth(request);
    requireAdmin(auth);

    await connectDB();

    const { orderId } = await context.params;
    const order = await getOrderByIdForAdmin(orderId);

    return NextResponse.json(
      new ApiResponse(
        200,
        "Admin order fetched successfully",
        order
      ),
      {
        status: 200,
      }
    );
  }
);
