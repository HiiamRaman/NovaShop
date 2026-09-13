import mongoose from "mongoose";

import {
  createOrder,
  findOrderByIdAndUserId,
  findOrdersByUserId,
  findAllOrders,
  findOrderByIdForAdmin
} from "@/repositories/order.repository";

import type { CreateOrderData,CreateOrderItemData } from "@/types/order.types";

import { ApiError } from "@/utils/ApiError";
import { validateCheckout } from "./checkout.service";

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
  const checkout = await validateCheckout(
    userId,
    addressId,
    items
  );

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
          throw new ApiError(
            409,
            `${item.name} no longer has enough stock`
          );
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

export async function getMyOrders(userId: string, orderId: string) {
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }
  const orders = await findOrdersByUserId( userId)
  if (!orders) {
    throw new ApiError(404, "Order not found");
  }
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
  }));;
}


export async function  getMyOrderById (userId:string,orderId:string) {
  if(!mongoose.Types.ObjectId.isValid(orderId)){
    throw new ApiError(400,"invalid order id ")
  }

  const order=  await findOrderByIdAndUserId(orderId,userId)
   console.log("order",order);
  if(!order){
    throw new ApiError(404,'Order not  found')
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
    const itemCount = (
      order.items as CreateOrderItemData[]
    ).reduce((total, item) => {
      return total + item.quantity;
    }, 0);

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
