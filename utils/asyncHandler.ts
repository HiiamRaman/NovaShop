import { NextResponse } from "next/server";

import { ApiError } from "./ApiError";
import { success } from "zod";
type AsyncHandler = (...args: any[]) => Promise<Response>;
export const asyncHandler = (fn: AsyncHandler) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error: unknown) {
      console.error("API Error:", error);

      //Expected Error
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
            errors: error.errors,
            data: error.data,
          },
          { status: error.statusCode }
        );
      }

      // Unexpected error
      return NextResponse.json(
        {
          success: false,
          message: "Internal Server Error",
        },
        {
          status: 500,
        }
      );
    }
  };
};
