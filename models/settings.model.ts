import mongoose from "mongoose";

export interface SettingsDocument {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: "NPR" | "USD";
  newOrderNotifications: boolean;
  paymentNotifications: boolean;
  lowStockNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new mongoose.Schema<SettingsDocument>(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
      default: "NovaShop",
    },

    supportEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "support@novashop.com",
    },

    supportPhone: {
      type: String,
      required: true,
      trim: true,
      default: "9812345678",
    },

    currency: {
      type: String,
      enum: ["NPR", "USD"],
      default: "NPR",
    },

    newOrderNotifications: {
      type: Boolean,
      default: true,
    },

    paymentNotifications: {
      type: Boolean,
      default: true,
    },

    lowStockNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Settings =
  mongoose.models.Settings ||
  mongoose.model<SettingsDocument>(
    "Settings",
    settingsSchema
  );
