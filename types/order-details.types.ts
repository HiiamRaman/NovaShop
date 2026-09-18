export interface OrderDetailItem {
  productId: string;
  name: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

export interface CustomerOrderDetails {
  id: string;
  items: OrderDetailItem[];
  shippingAddress: OrderShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export interface CancelOrderResponse {
  id: string;
  orderStatus: string;
  paymentStatus: string;
}
