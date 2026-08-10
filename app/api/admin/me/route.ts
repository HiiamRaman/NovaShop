import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/services/auth.service";
import { ApiResponse } from "@/utils/ApiResponse";

import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";
import { requireAdmin } from "@/utils/requireAdmin";

export const GET = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    // Verify the access-token cookie
    const auth = requireAuth(request);

    // Verify authorization before querying MongoDB
    requireAdmin(auth);

    await connectDB();

    const admin = await getCurrentUser(auth.sub);

    return NextResponse.json(
      new ApiResponse(200, "Admin authenticated successfully", admin),
      {
        status: 200,
      }
    );
  }
);
