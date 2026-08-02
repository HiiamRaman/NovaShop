import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { loginSchema } from "@/schemas/loginSchema";
import { loginUser } from "@/services/auth.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(
  async (request: Request): Promise<Response> => {
    // Ensure MongoDB is connected
    await connectDB();

    // Read and parse the JSON request body
    const body: unknown = await request.json();

    // Validate and type the untrusted data
    const validatedData = loginSchema.parse(body);

    // Verify the submitted credentials
    const user = await loginUser(validatedData);

    // Return the safe authenticated user
    return NextResponse.json(new ApiResponse(200, "Login successful", user), {
      status: 200,
    });
  }
);
