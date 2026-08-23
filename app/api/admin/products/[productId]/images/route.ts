import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/utils/requireAuth";
import { requireAdmin } from "@/utils/requireAdmin";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  addProductImages,
  removeProductImage,
} from "@/services/product.service";
import { validateProductImages } from "@/utils/validateProductImages";
import { connectDB } from "@/lib/mongodb";
import { removeProductImageSchema } from "@/schemas/productSchema";
interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}
export const PATCH = asyncHandler(
  async (req: NextRequest, context: RouteContext) => {
    const auth = requireAuth(req);
    requireAdmin(auth);
    await connectDB();
    const { productId } = await context.params;

    // Read the multipart/form-data request

    const formData = await req.formData();

    //get all images
    const imageEnteries = formData.getAll("images");
    // Validate file count, type, and size
    const files = validateProductImages(imageEnteries);
    // Upload images and update the product
    const product = await addProductImages(productId, files);
    return NextResponse.json(
      new ApiResponse(200, "Product images added successfully", product),
      {
        status: 200,
      }
    );
  }
);

export const DELETE = asyncHandler(
  async (req: NextRequest, context: RouteContext): Promise<Response> => {
    /*
Mental model:
1. Authenticate the current user
2. Confirm the user is an admin
3. Extract the product ID from the URL
4. Read and validate the image public ID
5. Remove the image through the service
6. Return the updated image list
*/

    const auth = requireAuth(req);
    requireAdmin(auth);
    await connectDB();
    const { productId } = await context.params;

    const body: unknown = await req.json();

    const validatedData = removeProductImageSchema.parse(body);

    const product = await removeProductImage(productId, validatedData.publicId);

    return NextResponse.json(
      new ApiResponse(200, "Product image removed successfully", product),
      {
        status: 200,
      }
    );
  }
);
