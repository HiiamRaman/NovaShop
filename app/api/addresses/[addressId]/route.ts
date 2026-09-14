import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { updateAddressSchema } from "@/schemas/addressSchema";
import { updateMyAddress } from "@/services/address.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { requireAuth } from "@/utils/requireAuth";
import { asyncHandler } from "@/utils/asyncHandler";
import { deleteMyAddress } from "@/services/address.service";
interface RouteContext {
  params: Promise<{
    addressId: string;
  }>;
}

export const PATCH = asyncHandler(
  async (req: NextRequest, context: RouteContext): Promise<Response> => {
    const user = requireAuth(req);
    await connectDB();
    const { addressId } = await context.params;

    const body: unknown = await req.json();
    const validatedData = updateAddressSchema.parse(body);

    const address = await updateMyAddress(user.sub, addressId, validatedData);
    return NextResponse.json(
      new ApiResponse(200, "Address updated successfully", address),
      {
        status: 200,
      }
    );
  }
);

export const DELETE = asyncHandler(
  async (
    request: NextRequest,
    context: RouteContext
  ): Promise<Response> => {
    await connectDB();

    const user = requireAuth(request);

    const { addressId } =
      await context.params;

    const deletedAddress =
      await deleteMyAddress(
        user.sub,
        addressId
      );

    return NextResponse.json(
      new ApiResponse(
        200,
        "Address deleted successfully",
        deletedAddress
      ),
      {
        status: 200,
      }
    );
  }
);
