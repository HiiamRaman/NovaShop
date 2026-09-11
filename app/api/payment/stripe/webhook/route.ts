import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { connectDB } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";
import { markOrderAsPaid } from "@/repositories/order.repository";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { handleExpiredStripeCheckout } from "@/services/payment.service";
export const POST = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    // Stripe signature verification requires the raw body.
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      throw new ApiError(400, "Stripe signature is missing");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch {
      throw new ApiError(400, "Invalid Stripe webhook signature");
    }

    await connectDB();

    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object;

      if (checkoutSession.payment_status === "paid") {
        const paymentIntentId =
          typeof checkoutSession.payment_intent === "string"
            ? checkoutSession.payment_intent
            : undefined;

        const updatedOrder = await markOrderAsPaid(
          checkoutSession.id,
          paymentIntentId
        );

        console.log("Updated paid order:", updatedOrder?._id);
      }
    }

    if (event.type === "checkout.session.expired") {
      const checkoutSession = event.data.object;

      await handleExpiredStripeCheckout(checkoutSession.id);
    }

    return NextResponse.json(
      new ApiResponse(200, "Stripe webhook processed successfully", {
        eventType: event.type,
      }),
      { status: 200 }
    );
  }
);
