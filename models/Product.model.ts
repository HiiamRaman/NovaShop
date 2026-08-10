import mongoose from "mongoose";
const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
      default: "",
    },
    position: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);


