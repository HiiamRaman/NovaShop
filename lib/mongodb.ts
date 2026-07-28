import mongoose from "mongoose";
import { env } from "./env";

const MONGODB_URI = env.MONGODB_URI;

const cached =
  global.mongoose ??
  (global.mongoose = {
    conn: null,
    promise: null,
  });

export async function connectDB() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI);
    }

    cached.conn = await cached.promise;

    console.log("MongoDB Connected!!!");

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.log("MongoDb connection Error", error);
    throw error;
  }
}
