import { NextResponse } from "next/server";

import { ApiError } from "./ApiError";
import { ZodError } from "zod";
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
            data: null,
          },
          { status: error.statusCode }
        );
      }
      //zod error
      if (error instanceof ZodError) {
        console.error("Zod Validation Error:", error);
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: error.issues,
          },
          {
            status: 400,
          }
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
