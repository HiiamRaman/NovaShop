import { NextResponse, NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";

import { createStripeCheckout } from "@/services/payment.service";
import { createStripeCheckoutSchema } from "@/schemas/paymentSchema";

import { requireAuth } from "@/utils/requireAuth";

export const POST = asyncHandler(
  async (req: NextRequest): Promise<Response> => {
    const user = requireAuth(req);
    await connectDB();
    const body: unknown = await req.json();

    const { orderId } = createStripeCheckoutSchema.parse(body);
    const checkout = await createStripeCheckout(user.sub, orderId);
    return NextResponse.json(
      new ApiResponse(
        200,
        "Stripe checkout session created successfully",
        checkout
      ),
      {
        status: 200,
      }
    );
  }
);
