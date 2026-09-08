import mongoose from "mongoose";
import type { CreateOrderItemData } from "@/types/order.types";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import {
  findPendingOrderForPayment,
  saveStripeCheckoutSessionId,
} from "@/repositories/order.repository";
import { ApiError } from "@/utils/ApiError";

export async function createStripeCheckout(userId: string, orderId: string) {
  // Prevent MongoDB CastError.
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  // Find the logged-in user's unpaid order.
  const order = await findPendingOrderForPayment(orderId, userId);

  if (!order) {
    throw new ApiError(404, "Pending order not found");
  }

  // Ask Stripe to create its hosted payment page.
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: order.items.map((item: CreateOrderItemData) => ({
      quantity: item.quantity,

      price_data: {
        currency: order.currency.toLowerCase(),

        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },

        // Your database already stores prices in minor units.
        unit_amount: item.unitPrice,
      },
    })),

    metadata: {
      orderId: order._id.toString(),
      userId,
    },

    success_url: `${env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/checkout`,
  });

  if (!checkoutSession.url) {
    throw new ApiError(500, "Stripe checkout URL was not created");
  }

  // Connect Stripe's session with our NovaShop order.
  await saveStripeCheckoutSessionId(order._id.toString(), checkoutSession.id);

  return {
    checkoutUrl: checkoutSession.url,
  };
}
