import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

import { AccessTokenPayload } from "@/types/token.types";
import { ApiError } from "./ApiError";

export function requireAuth(request: NextRequest): AccessTokenPayload {
  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken) {
    throw new ApiError(401, "Authentication required");
  }

  return verifyAccessToken(accessToken);
}
