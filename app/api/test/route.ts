import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: "MongoDb Connected Successfullyy",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to connect mongoDb" },
      { status: 500 }
    );
  }
}
