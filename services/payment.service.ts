import mongoose from "mongoose";

import type { CreateOrderItemData } from "@/types/order.types";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import {
  findPendingOrderForPayment,
  markExpiredOrder,
  saveStripeCheckoutSessionId,
} from "@/repositories/order.repository";
import { restoreProductStock } from "@/repositories/product.repository";
import { ApiError } from "@/utils/ApiError";

export async function createStripeCheckout(userId: string, orderId: string) {
  // Prevent MongoDB CastError.
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  // Find an unpaid order belonging to the logged-in user.
  const order = await findPendingOrderForPayment(orderId, userId);

  if (!order) {
    throw new ApiError(404, "Pending order not found");
  }

  /*
   * Reuse an existing open Stripe Session.
   * This prevents duplicate payment pages.
   */
  if (order.stripeCheckoutSessionId) {
    const existingSession = await stripe.checkout.sessions.retrieve(
      order.stripeCheckoutSessionId
    );

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

  // Create Stripe's hosted Checkout page.
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

          // NovaShop stores prices in minor units.
          unit_amount: item.unitPrice,
        },
      })),

      /*
       * Stripe returns this metadata in webhook events.
       * The webhook uses orderId to update the order.
       */
      metadata: {
        orderId: order._id.toString(),
        userId,
      },

      /*
       * UPDATED:
       * The success page receives the Stripe Session ID
       * and NovaShop order ID.
       */
      success_url:
        `${env.APP_URL}/success` +
        `?session_id={CHECKOUT_SESSION_ID}` +
        `&order_id=${order._id.toString()}`,

      cancel_url: `${env.APP_URL}/checkout`,
    },
    {
      // Prevent duplicate Stripe Sessions for one order.
      idempotencyKey: `checkout-${order._id.toString()}`,
    }
  );

  if (!checkoutSession.url) {
    throw new ApiError(500, "Stripe checkout URL was not created");
  }

  // Connect the Stripe Session with the MongoDB order.
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
      /*
       * Only an order that is still pending can
       * be marked as failed and cancelled.
       */
      const order = await markExpiredOrder(
        stripeCheckoutSessionId,
        mongoSession
      );

      /*
       * Null means this webhook was already handled,
       * or the order is no longer pending.
       */
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
