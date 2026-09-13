import { Order } from "@/models/Order.model";
import type { CreateOrderData } from "@/types/order.types";
import { ClientSession } from "mongoose";
import mongoose from "mongoose";
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

export async function markOrderAsPaid(
  stripeCheckoutSessionId: string,
  stripePaymentIntentId?: string
) {
  return Order.findOneAndUpdate(
    { stripeCheckoutSessionId, paymentStatus: "pending" },
    {
      $set: {
        paymentStatus: "paid",
        stripePaymentIntentId,
        paidAt: new Date(),
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
}

export async function markExpiredOrder(
  stripeCheckoutSessionId: string,
  session: ClientSession
) {
  return Order.findOneAndUpdate(
    { stripeCheckoutSessionId, paymentStatus: "pending" },
    {
      $set: {
        paymentStatus: "failed",
        orderStatus: "cancelled",
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
      session,
    }
  );
}

// Fetch every order for the admin panel.
export async function findAllOrders() {
  return Order.find().sort({
    createdAt: -1,
  });
}

// Find any non-deleted order by ID for the admin panel.
export async function findOrderByIdForAdmin(orderId: string) {
  return Order.findById(orderId);
}


interface CustomerOrderStat {
  _id: mongoose.Types.ObjectId;
  orders: number;
  totalSpent: number;
}
// Calculate order count and paid spending for every customer.
export async function getCustomerOrderStats() {
  return Order.aggregate<CustomerOrderStat>([
    {
      $group: {
        _id: "$userId",

        orders: {
          $sum: 1,
        },

        totalSpent: {
          $sum: {
            $cond: [
              {
                $eq: ["$paymentStatus", "paid"],
              },
              "$total",
              0,
            ],
          },
        },
      },
    },
  ]);
}

interface CustomerOrderStat {
  orders: number;
  totalSpent: number;
}

export async function getCustomerOrderStatsById(
  customerId: string
): Promise<CustomerOrderStat | null> {
  const statistics = await Order.aggregate<CustomerOrderStat>([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(customerId),
      },
    },
    {
      $group: {
        _id: "$userId",

        orders: {
          $sum: 1,
        },

        totalSpent: {
          $sum: {
            $cond: [
              {
                $eq: ["$paymentStatus", "paid"],
              },
              "$total",
              0,
            ],
          },
        },
      },
    },
  ]);

  return statistics[0] ?? null;
}
