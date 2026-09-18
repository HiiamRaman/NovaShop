import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { cancelMyOrder } from "@/services/order.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";
interface RouteContext {
  params: Promise<{
    orderId: string;
  }>;
}

export const PATCH = asyncHandler(
  async (req: NextRequest, context: RouteContext): Promise<Response> => {
    const auth = requireAuth(req);
    await connectDB();
    const { orderId } = await context.params;
    const cancelledOrder = await cancelMyOrder(auth.sub, orderId);
    return NextResponse.json(
      new ApiResponse(200, "Order cancelled successfully", cancelledOrder),
      {
        status: 200,
      }
    );
  }
);
