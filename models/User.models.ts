import mongoose from "mongoose";
import { minLength } from "zod";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],  //validation
    },
    password: {
      type: String,
      required: true,
      minLength:8,
      trim: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default:'user'
    }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
