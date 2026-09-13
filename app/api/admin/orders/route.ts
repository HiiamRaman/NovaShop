import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAllOrdersForAdmin } from "@/services/order.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";

/*
GET /api/admin/orders

Mental model:
1. Check that the user is logged in
2. Check that the user is an admin
3. Connect to MongoDB
4. Fetch all customer orders
5. Return the orders
*/
export const GET = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    const auth = requireAuth(request);
    requireAdmin(auth);

    await connectDB();

    const orders = await getAllOrdersForAdmin();

    return NextResponse.json(
      new ApiResponse(
        200,
        "Admin orders fetched successfully",
        orders
      ),
      {
        status: 200,
      }
    );
  }
);
