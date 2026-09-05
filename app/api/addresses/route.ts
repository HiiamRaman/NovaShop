import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { createAddressSchema } from "@/schemas/addressSchema";
import { addAddress, getMyAddresses } from "@/services/address.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";

// Create an address for the logged-in user.
export const POST = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    await connectDB();

    const user = requireAuth(request);

    const body: unknown = await request.json();
    const validatedData = createAddressSchema.parse(body);

    const address = await addAddress({
      userId: user.sub,
      ...validatedData,
      isDefault: validatedData.isDefault ?? false,
    });

    return NextResponse.json(
      new ApiResponse(201, "Address created successfully", address),
      { status: 201 }
    );
  }
);

// Get all addresses belonging to the logged-in user.
export const GET = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    await connectDB();

    const user = requireAuth(request);

    const addresses = await getMyAddresses(user.sub);

    return NextResponse.json(
      new ApiResponse(200, "Addresses fetched successfully", addresses),
      { status: 200 }
    );
  }
);
