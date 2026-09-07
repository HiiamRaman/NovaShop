import { Order } from "@/models/Order.model";
import type { CreateOrderData } from "@/types/order.types";

// Save a validated order in MongoDB.
export async function createOrder(data: CreateOrderData) {
  return Order.create(data);
}

// Get all orders belonging to one user.
export async function findOrdersByUserId(userId: string) {
  return Order.find({ userId }).sort({ createdAt: -1 });
}
// Get one order only if it belongs to the user.
export async function findOrderByIdAndUserId(orderId: string, userId: string) {
  return Order.findOne({ _id: orderId, userId });
}

