import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { logoutSession } from "@/services/auth.service";

import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(
  async (req: NextRequest): Promise<Response> => {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      await connectDB();

      try {
        await logoutSession(refreshToken);
      } catch (error: unknown) {
        const isAlreadyLoggedOut =
          error instanceof ApiError && error.statusCode === 401;

        if (!isAlreadyLoggedOut) {
          throw error;
        }
      }
    }

    const response = NextResponse.json(
      new ApiResponse(200, "Logged out successfully"),
      {
        status: 200,
      }
    );

    const clearCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    };

    response.cookies.set("accessToken", "", clearCookieOptions);
    response.cookies.set("refreshToken", "", clearCookieOptions);

    return response;
  }
);
