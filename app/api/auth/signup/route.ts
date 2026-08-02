import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { signupSchema } from "@/schemas/signupSchema";
import { registerUser } from "@/services/auth.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(
  async (request: Request): Promise<Response> => {
    // Ensure MongoDB is connected
    await connectDB();

    // Read the untrusted request body
    const body: unknown = await request.json();

    // Validate and type the request data
    const validatedData = signupSchema.parse(body);

    // Execute signup business logic
    const user = await registerUser(validatedData);

    // Return a standardized 201 response
    return NextResponse.json(
      new ApiResponse(201, "User registered successfully", user),
      {
        status: 201,
      }
    );
  }
);
