import mongoose from "mongoose";

export interface AddressDocument {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  isDefault: boolean;
}

const addressSchema = new mongoose.Schema<AddressDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Address =
  mongoose.models.Address ||
  mongoose.model<AddressDocument>("Address", addressSchema);
