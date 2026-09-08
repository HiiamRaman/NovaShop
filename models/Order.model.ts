import mongoose from "mongoose";

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  image: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

export interface OrderDocument {
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  currency: "NPR" | "USD";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  stripeCheckoutSessionId?: string;
  paidAt?: Date;
  expiresAt?: Date;
}

const orderItemSchema = new mongoose.Schema<OrderItem>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const shippingAddressSchema = new mongoose.Schema<ShippingAddress>(
  {
    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shipping: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["NPR", "USD"],
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    stripeCheckoutSessionId: {
      type: String,
      index: true,
    },

    paidAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Order =
  mongoose.models.Order || mongoose.model<OrderDocument>("Order", orderSchema);
