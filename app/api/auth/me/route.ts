import { connectDB } from "@/lib/mongodb";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/services/auth.service";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";

export const GET = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    // Verify the token before performing a database query
    const auth = requireAuth(request);

    await connectDB();

    // `sub` contains the authenticated user ID
    const user = await getCurrentUser(auth.sub);

    return NextResponse.json(
      new ApiResponse(200, "Current user fetched successfully", user),
      {
        status: 200,
      }
    );
  }
);
