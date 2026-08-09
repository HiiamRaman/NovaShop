import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/utils/requireAuth";
import { z } from "zod";
import { removeUserSession } from "@/services/auth.service";

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

const sessionIdSchema = z.uuid("Invalid session ID");

export const DELETE = asyncHandler(
  async (request: NextRequest, context: RouteContext): Promise<Response> => {
    // Verify the user making the request
    const auth = requireAuth(request);

    // Read sessionId from the dynamic URL
    const { sessionId } = await context.params;

    // Validate the untrusted URL parameter
    const targetSessionId = sessionIdSchema.parse(sessionId);

    await connectDB();

    // Revoke only a session owned by this user
    await removeUserSession(auth.sub, targetSessionId, auth.sessionId);

    return NextResponse.json(
      new ApiResponse(200, "Session removed successfully", null),
      {
        status: 200,
      }
    );
  }
);
