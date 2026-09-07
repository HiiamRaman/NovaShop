import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";
import { ApiResponse } from "@/utils/ApiResponse";
import { connectDB } from "@/lib/mongodb";
import { getMyOrderById } from "@/services/order.service";

interface AuthContext {
  params: Promise<{
    orderId: string;
  }>;
}

export const GET = asyncHandler(
  async (req: NextRequest, context: AuthContext): Promise<Response> => {
    const user = requireAuth(req);
    const { orderId } = await context.params;
    await connectDB();

    const order = await getMyOrderById(user.sub, orderId);

    return NextResponse.json(
      new ApiResponse(200, "Order fetched successfully", order),
      {
        status: 200,
      }
    );
  }
);
