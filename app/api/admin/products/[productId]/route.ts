import { NextRequest,NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { requireAdmin } from "@/utils/requireAdmin";
import { requireAuth } from "@/utils/requireAuth";
import { connectDB } from "@/lib/mongodb";
import { editProduct,removeProduct } from "@/services/product.service";
import { updateProductSchema } from "@/schemas/productSchema";
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

    const body: unknown = await req.json();
    const validatedData = updateProductSchema.parse(body);

    const product = await editProduct(productId, validatedData);

    return NextResponse.json(
      new ApiResponse(200, "Product updated successfully", product),
      {
        status: 200,
      }
    );
  }
);

export const DELETE = asyncHandler(async(req:NextRequest,context:RouteContext):Promise<Response>=>{
    const auth = requireAuth(req)
    requireAdmin(auth)

await connectDB()


const {productId} = await context.params
const product = await removeProduct(productId)


return NextResponse.json(new ApiResponse(200,'Product deleted successfully',product),
{
    status:200
})




})
