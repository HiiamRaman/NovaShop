import { NextResponse ,NextRequest} from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";

import { createStripeCheckout } from "@/services/payment.service";
import { createStripeCheckoutSchema } from "@/schemas/paymentSchema";

import { requireAuth } from "@/utils/requireAuth";


export const POST = asyncHandler(async()=>{
    
})
