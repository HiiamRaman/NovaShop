import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { updateSettingsSchema } from "@/schemas/settingsSchema";
import {
  getStoreSettings,
  updateStoreSettings,
} from "@/services/settings.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";

export const GET = asyncHandler(async (req: NextRequest): Promise<Response> => {
  const auth = requireAuth(req);
  requireAdmin(auth);
  await connectDB();
  const settings = await getStoreSettings();

  return NextResponse.json(
    new ApiResponse(200, "Settings fetched successfully", settings),
    {
      status: 200,
    }
  );
});

export const PATCH = asyncHandler(
  async (req: NextRequest): Promise<Response> => {
    const auth = requireAuth(req);
    requireAdmin(auth);

    await connectDB();
    const body: unknown = await req.json();
    const settingsData = updateSettingsSchema.parse(body);
    const settings = await updateStoreSettings(settingsData);
    return NextResponse.json(
      new ApiResponse(200, "Settings updated successfully", settings),
      {
        status: 200,
      }
    );
  }
);
