export interface CreateOrderItemData {
  productId: string;
  name: string;
  image: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderAddressData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

export interface CreateOrderData {
  userId: string;
  items: CreateOrderItemData[];
  shippingAddress: OrderAddressData;
  subtotal: number;
  shipping: number;
  total: number;
  currency: "NPR" | "USD";
}
