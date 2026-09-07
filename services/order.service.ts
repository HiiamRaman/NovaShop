import mongoose from "mongoose";

import {
  createOrder,
  findOrderByIdAndUserId,
  findOrdersByUserId,
} from "@/repositories/order.repository";

import type { CreateOrderData } from "@/types/order.types";

import { ApiError } from "@/utils/ApiError";
import { validateCheckout } from "./checkout.service";
import { check } from "zod";
import { create } from "domain";

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
  const order = await createOrder(orderData);
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
