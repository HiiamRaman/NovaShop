import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { checkoutSchema } from "@/validators/checkout.validators";
import { validateCheckout } from "@/services/checkout.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/utils/requireAuth";
 
/*
POST /api/checkout/validate

1. Connect to MongoDB
2. Authenticate the user
3. Validate the request body
4. Verify address, products, and stock
5. Calculate and return trusted totals
*/
export const POST = asyncHandler(
  async (request: NextRequest): Promise<Response> => {
    await connectDB();

    // Get the registered user's ID from the access token.
    const user = requireAuth(request);

    // Read the checkout request.
    const body: unknown = await request.json();

    // Validate addressId and cart items.
    const { addressId, items } = checkoutSchema.parse(body);

    // Validate checkout using the authenticated user's ID.
    const checkout = await validateCheckout(
      user.sub,
      addressId,
      items
    );

    return NextResponse.json(
      new ApiResponse(
        200,
        "Checkout validated successfully",
        checkout
      ),
      { status: 200 }
    );
  }
);
