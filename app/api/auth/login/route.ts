import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { loginSchema } from "@/schemas/loginSchema";
import { loginUser } from "@/services/auth.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { env } from "@/lib/env";
export const POST = asyncHandler(
  async (request: Request): Promise<Response> => {
    // Ensure MongoDB is connected
    await connectDB();

    // Read and parse the JSON request body
    const body: unknown = await request.json();

    // Validate and type the untrusted data
    const validatedData = loginSchema.parse(body);
    // Read browser/device metadata
    const userAgent = (request.headers.get("user-agent") ?? "Unknown").slice(0,500)

    // Verify the submitted credentials
    const { user, accessToken, refreshToken } = await loginUser(validatedData, {
      userAgent,
    });

    const response = NextResponse.json(
      new ApiResponse(200, "Login successful", user),
      {
        status: 200,
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    response.cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: env.ACCESS_TOKEN_EXPIRY,
    });

    response.cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: env.REFRESH_TOKEN_EXPIRY,
    });

    // Return the safe authenticated user
    return response;
  }
);
