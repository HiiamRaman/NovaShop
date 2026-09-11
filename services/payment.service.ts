import mongoose from "mongoose";
import type { CreateOrderItemData } from "@/types/order.types";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import {
  findPendingOrderForPayment,
  saveStripeCheckoutSessionId,
  markExpiredOrder,
} from "@/repositories/order.repository";
import { restoreProductStock } from "@/repositories/product.repository";
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

  if (order.stripeCheckoutSessionId) {
    const existingSession = await stripe.checkout.sessions.retrieve(
      order.stripeCheckoutSessionId
    );

    // Return the same payment page instead of creating another one.
    if (existingSession.status === "open" && existingSession.url) {
      return {
        checkoutUrl: existingSession.url,
      };
    }

    throw new ApiError(
      409,
      "This order already has a completed or expired checkout session"
    );
  }

  // Ask Stripe to create its hosted payment page.
  const checkoutSession = await stripe.checkout.sessions.create(
  {
    mode: "payment",

    line_items: order.items.map((item: CreateOrderItemData) => ({
      quantity: item.quantity,

      price_data: {
        currency: order.currency.toLowerCase(),

        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },

        unit_amount: item.unitPrice,
      },
    })),

    metadata: {
      orderId: order._id.toString(),
      userId,
    },

    success_url: `${env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/checkout`,
  },
  {
    // Prevent duplicate sessions for the same order.
    idempotencyKey: `checkout-${order._id.toString()}`,
  }
);

  if (!checkoutSession.url) {
    throw new ApiError(500, "Stripe checkout URL was not created");
  }

  // Connect Stripe's session with our NovaShop order.
  await saveStripeCheckoutSessionId(order._id.toString(), checkoutSession.id);

  return {
    checkoutUrl: checkoutSession.url,
  };
}
export async function handleExpiredStripeCheckout(
  stripeCheckoutSessionId: string
) {
  const mongoSession = await mongoose.startSession();

  try {
    return await mongoSession.withTransaction(async () => {
      // Only a pending order can be expired.
      const order = await markExpiredOrder(
        stripeCheckoutSessionId,
        mongoSession
      );

      // The order may already be paid, failed, or previously processed.
      if (!order) {
        return null;
      }

      // Return every reserved item to product stock.
      for (const item of order.items as CreateOrderItemData[]) {
        const product = await restoreProductStock(
          item.productId.toString(),
          item.quantity,
          mongoSession
        );

        if (!product) {
          throw new ApiError(500, `Failed to restore stock for ${item.name}`);
        }
      }

      return order;
    });
  } finally {
    await mongoSession.endSession();
  }
}
