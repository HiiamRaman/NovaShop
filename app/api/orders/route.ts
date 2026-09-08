import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/utils/ApiResponse";
import { connectDB } from "@/lib/mongodb";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";
import { validateCheckoutSchema } from "@/schemas/checkoutSchema";
import { placeOrder, getMyOrders } from "@/services/order.service";
import { findOrderByIdAndUserId } from "@/repositories/order.repository";

/*
POST /api/orders
Create an order for the logged-in user.
*/

export const POST = asyncHandler(
  async (req: NextRequest): Promise<Response> => {
    const user = requireAuth(req);
    const body: unknown = await req.json();
    await connectDB();

    // Order creation requires the same data as checkout validation.

    const { addressId, items } = validateCheckoutSchema.parse(body);

    const orders = await placeOrder(user.sub, addressId, items);

    return NextResponse.json(
      new ApiResponse(201, "Order created successfully", orders),
      {
        status: 201,
      }
    );
  }
);

export const GET = asyncHandler(
  async (req: NextRequest, orderId: string): Promise<Response> => {
    const user = requireAuth(req);
    await connectDB();

    const orders = await getMyOrders(user.sub, orderId);

    return NextResponse.json(
      new ApiResponse(200, "Orders fetched successfully", orders),
      {
        status: 200,
      }
    );
  }
);
