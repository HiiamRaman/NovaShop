import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logoutAllSessions } from "@/services/auth.service";
import { connectDB } from "@/lib/mongodb";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";

export const POST = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    // Verify user and obtain the trusted userId
    const auth = requireAuth(request);

    await connectDB();

    // Revoke every active session owned by this user
    await logoutAllSessions(auth.sub);

    const response = NextResponse.json(
      new ApiResponse(
        200,
        "Logged out from all devices successfully",
        null
      ),
      {
        status: 200,
      }
    );

    // Clear this browser's authentication cookies
    const clearCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    };

    response.cookies.set(
      "accessToken",
      "",
      clearCookieOptions
    );

    response.cookies.set(
      "refreshToken",
      "",
      clearCookieOptions
    );

    return response;
  }
);
