import type { AccessTokenPayload } from "@/types/token.types";
import { ApiError } from "@/utils/ApiError";

export function requireAdmin(auth: AccessTokenPayload): void {
  if (auth.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
}
