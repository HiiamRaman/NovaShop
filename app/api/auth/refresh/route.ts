import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { connectDB } from "@/lib/mongodb";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { refreshAuthSession } from "@/services/auth.service";

export const POST = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    // Read the long-lived token from its HttpOnly cookie
    const receivedRefreshToken = request.cookies.get("refreshToken")?.value;

    if (!receivedRefreshToken) {
      throw new ApiError(401, "Refresh token required");
    }

    await connectDB();

    // Verify the session and rotate the token pair
    const { accessToken, refreshToken } =
      await refreshAuthSession(receivedRefreshToken);

    const response = NextResponse.json(
      new ApiResponse(200, "Tokens refreshed successfully", null),
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

    return response;
  }
);
