export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type NextOrderStatus =
  | "confirmed"
  | "shipped"
  | "delivered";

export interface AdminOrderItem {
  productId: string;
  name: string;
  image: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface AdminShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

export interface AdminOrderDetails {
  id: string;
  items: AdminOrderItem[];
  shippingAddress: AdminShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  currency: "NPR" | "USD";
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface UpdateOrderStatusResponse {
  id: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}
