import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { changePasswordSchema } from "@/schemas/changePasswordSchema";
import { changePassword } from "@/services/auth.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";

export const PATCH = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    await connectDB();

    // Identify the user from the access token.
    const auth = requireAuth(request);

    const body: unknown = await request.json();

    const validatedData = changePasswordSchema.parse(body);

    await changePassword(auth.sub, {
      currentPassword: validatedData.currentPassword,

      newPassword: validatedData.newPassword,
    });

    return NextResponse.json(
      new ApiResponse(200, "Password changed successfully", {
        changed: true,
      }),
      {
        status: 200,
      }
    );
  }
);
