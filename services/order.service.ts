import mongoose from "mongoose";

import {
  createOrder,
  findOrderByIdAndUserId,
  findOrdersByUserId,
  findAllOrders,
  findOrderByIdForAdmin,
  cancelPendingOrderByUser,
  updateOrderStatusForAdmin,
} from "@/repositories/order.repository";
import { restoreProductStock } from "@/repositories/product.repository";
import type { CreateOrderData, CreateOrderItemData } from "@/types/order.types";

import { ApiError } from "@/utils/ApiError";
import { validateCheckout } from "./checkout.service";
import { stripe } from "@/lib/stripe";
import { decreaseProductStock } from "@/repositories/product.repository";
interface OrderItemInput {
  productId: string;
  quantity: number;
}
/*
1. Validate the checkout again
2. Create permanent product and address snapshots
3. Save the order
4. Return the created order
*/

export async function placeOrder(
  userId: string,
  addressId: string,
  items: OrderItemInput[]
) {
  // Validate address, products, prices and stock.
  const checkout = await validateCheckout(userId, addressId, items);

  const orderData: CreateOrderData = {
    userId,
    items: checkout.items,

    shippingAddress: {
      fullName: checkout.address.fullName,
      phone: checkout.address.phone,
      city: checkout.address.city,
      address: checkout.address.address,
    },

    subtotal: checkout.subtotal,
    shipping: checkout.shipping,
    total: checkout.total,
    currency: checkout.currency,
  };

  const session = await mongoose.startSession();

  try {
    const order = await session.withTransaction(async () => {
      // Reduce the stock of every ordered product.
      for (const item of checkout.items) {
        const updatedProduct = await decreaseProductStock(
          item.productId,
          item.quantity,
          session
        );

        // null means the product is unavailable or lacks stock.
        if (!updatedProduct) {
          throw new ApiError(409, `${item.name} no longer has enough stock`);
        }
      }

      // Save the order in the same transaction.
      return createOrder(orderData, session);
    });

    if (!order) {
      throw new ApiError(500, "Order creation failed");
    }

    return {
      id: order._id.toString(),
      items: order.items,
      shippingAddress: order.shippingAddress,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      currency: order.currency,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    };
  } finally {
    // Always close the database session.
    await session.endSession();
  }
}

export async function getMyOrders(userId: string) {
  const orders = await findOrdersByUserId(userId);

  return orders.map((order) => ({
    id: order._id.toString(),
    items: order.items,
    shippingAddress: order.shippingAddress,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    currency: order.currency,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
  }));
}

export async function getMyOrderById(userId: string, orderId: string) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "invalid order id ");
  }

  const order = await findOrderByIdAndUserId(orderId, userId);

  if (!order) {
    throw new ApiError(404, "Order not  found");
  }
  return {
    id: order._id.toString(),
    items: order.items,
    shippingAddress: order.shippingAddress,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    currency: order.currency,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
  };
}

export async function getAllOrdersForAdmin() {
  const orders = await findAllOrders();

  return orders.map((order) => {
    const itemCount = (order.items as CreateOrderItemData[]).reduce(
      (total, item) => {
        return total + item.quantity;
      },
      0
    );

    return {
      id: order._id.toString(),
      customer: order.shippingAddress.fullName,
      itemCount,
      total: order.total,
      currency: order.currency,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    };
  });
}

export async function getOrderByIdForAdmin(orderId: string) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await findOrderByIdForAdmin(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return {
    id: order._id.toString(),
    items: order.items,
    shippingAddress: order.shippingAddress,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    currency: order.currency,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
  };
}

export async function cancelMyOrder(userId: string, orderId: string) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  // Check ownership and current order state.
  const existingOrder = await findOrderByIdAndUserId(orderId, userId);

  if (!existingOrder) {
    throw new ApiError(404, "Order not found");
  }

  if (existingOrder.orderStatus === "cancelled") {
    throw new ApiError(409, "Order is already cancelled");
  }

  if (existingOrder.paymentStatus === "paid") {
    throw new ApiError(409, "Paid orders cannot be cancelled from this page");
  }

  if (
    existingOrder.orderStatus !== "pending" ||
    existingOrder.paymentStatus !== "pending"
  ) {
    throw new ApiError(409, "This order can no longer be cancelled");
  }

  /*
  An order may already have an open Stripe Checkout page.

  Expire it before changing the database so that the
  customer cannot pay for the cancelled order afterward.
  */
  if (existingOrder.stripeCheckoutSessionId) {
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      existingOrder.stripeCheckoutSessionId
    );

    if (checkoutSession.payment_status === "paid") {
      throw new ApiError(409, "Payment has already been completed");
    }

    if (checkoutSession.status === "open") {
      await stripe.checkout.sessions.expire(checkoutSession.id);
    }
  }

  const mongoSession = await mongoose.startSession();

  try {
    const cancelledOrder = await mongoSession.withTransaction(async () => {
      /*
          This update succeeds only if the order is
          still pending and unpaid.
          */
      const updatedOrder = await cancelPendingOrderByUser(
        orderId,
        userId,
        mongoSession
      );

      if (!updatedOrder) {
        throw new ApiError(
          409,
          "Order status changed and it can no longer be cancelled"
        );
      }

      // Return all reserved quantities to stock.
      for (const item of existingOrder.items as CreateOrderItemData[]) {
        const restoredProduct = await restoreProductStock(
          item.productId.toString(),
          item.quantity,
          mongoSession
        );

        if (!restoredProduct) {
          throw new ApiError(500, `Failed to restore stock for ${item.name}`);
        }
      }

      return updatedOrder;
    });

    if (!cancelledOrder) {
      throw new ApiError(500, "Order cancellation failed");
    }

    return {
      id: cancelledOrder._id.toString(),
      orderStatus: cancelledOrder.orderStatus,
      paymentStatus: cancelledOrder.paymentStatus,
    };
  } finally {
    await mongoSession.endSession();
  }
}

type AdminOrderStatus = "confirmed" | "shipped" | "delivered";

export async function updateOrderStatusByAdmin(
  orderId: string,
  nextStatus: AdminOrderStatus
) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await findOrderByIdForAdmin(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.orderStatus === "cancelled") {
    throw new ApiError(409, "Cancelled orders cannot be updated");
  }

  if (order.orderStatus === "delivered") {
    throw new ApiError(409, "This order has already been delivered");
  }

  // Only successfully paid orders can enter
  // the delivery workflow.
  if (order.paymentStatus !== "paid") {
    throw new ApiError(409, "Only paid orders can be processed");
  }

  let expectedNextStatus: AdminOrderStatus | null = null;

  if (order.orderStatus === "pending") {
    expectedNextStatus = "confirmed";
  }

  if (order.orderStatus === "confirmed") {
    expectedNextStatus = "shipped";
  }

  if (order.orderStatus === "shipped") {
    expectedNextStatus = "delivered";
  }

  if (nextStatus !== expectedNextStatus) {
    throw new ApiError(
      409,
      `Order must move from ${order.orderStatus} to ${
        expectedNextStatus ?? "no further status"
      }`
    );
  }

  const updatedOrder = await updateOrderStatusForAdmin(
    orderId,
    order.orderStatus,
    nextStatus
  );

  if (!updatedOrder) {
    throw new ApiError(
      409,
      "Order status changed before this update was completed"
    );
  }

  return {
    id: updatedOrder._id.toString(),
    orderStatus: updatedOrder.orderStatus,
    paymentStatus: updatedOrder.paymentStatus,
  };
}



