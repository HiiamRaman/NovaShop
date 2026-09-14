export type ProfileTab =
  | "personal"
  | "orders"
  | "addresses"
  | "security";
export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

export interface ProfileAddress {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  isDefault?: boolean;
}

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

export interface ProfileOrder {
  id: string;
  total: number;
  currency: "NPR" | "USD";
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}
