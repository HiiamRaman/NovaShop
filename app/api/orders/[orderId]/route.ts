import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getMyOrderById } from "@/services/order.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";

interface RouteContext {
  params: Promise<{
    orderId: string;
  }>;
}

/*
GET /api/orders/[orderId]

Return one order only when it belongs
to the logged-in customer.
*/
export const GET = asyncHandler(
  async (request: NextRequest, context: RouteContext): Promise<Response> => {
    const user = requireAuth(request);

    await connectDB();

    const { orderId } = await context.params;

    const order = await getMyOrderById(user.sub, orderId);

    return NextResponse.json(
      new ApiResponse(200, "Order fetched successfully", order),
      { status: 200 }
    );
  }
);
