import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    // Stripe signs the original raw request body.
    const rawBody = await request.text();

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      throw new ApiError(400, "Stripe signature is missing");
    }

    let event;

    try {
      // Confirm that this request genuinely came from Stripe.
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch {
      throw new ApiError(400, "Invalid Stripe webhook signature");
    }

    // We will add payment-status logic here next.
    console.log("Stripe event received:", event.type);

    return NextResponse.json(
      new ApiResponse(200, "Stripe webhook received successfully", {
        eventType: event.type,
      }),
      { status: 200 }
    );
  }
);
