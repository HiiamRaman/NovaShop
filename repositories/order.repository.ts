import { Order } from "@/models/Order.model";
import type { CreateOrderData } from "@/types/order.types";
import { ClientSession } from "mongoose";
// Save a validated order in MongoDB.
export async function createOrder(
  data: CreateOrderData,
  session?: ClientSession
) {
  // Normal creation without a transaction.
  if (!session) {
    return Order.create(data);
  }
  const createOrders = await Order.create([data], {
    session,
  });
  return createOrders[0];
}

// Get all orders belonging to one user.
export async function findOrdersByUserId(userId: string) {
  return Order.find({ userId }).sort({ createdAt: -1 });
}
// Get one order only if it belongs to the user.
export async function findOrderByIdAndUserId(orderId: string, userId: string) {
  return Order.findOne({ _id: orderId, userId });
}

// Find a pending order that belongs to the logged-in user.
export async function findPendingOrderForPayment(
  orderId: string,
  userId: string
) {
  return Order.findOne({ _id: orderId, userId, paymentStatus: "pending" });
}

// Store the Stripe Checkout session ID on the order.
export async function saveStripeCheckoutSessionId(
  orderId: string,
  stripeCheckoutSessionId: string
) {
  return Order.findByIdAndUpdate(
    orderId,
    {
      $set: { stripeCheckoutSessionId, paymentProvider: "stripe" },
    },
    {
      new: true,
      runValidators: true,
    }
  );
}
