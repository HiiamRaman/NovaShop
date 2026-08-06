import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { connectDB } from "@/lib/mongodb";

import { getUserSessions } from "@/services/auth.service";
import { requireAuth } from "@/utils/requireAuth";

export const GET = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    // Verify the access-token cookie
    const auth = requireAuth(request);

    await connectDB();

    // Find this user's active sessions and mark the current one
    const sessions = await getUserSessions(auth.sub, auth.sessionId);

    return NextResponse.json(
      new ApiResponse(200, "Active sessions fetched successfully", sessions),
      {
        status: 200,
      }
    );
  }
);
