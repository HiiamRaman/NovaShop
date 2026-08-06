import "server-only"; // This entire module must stay on the server
import jwt from "jsonwebtoken";
import { env } from "./env";
import { ApiError } from "@/utils/ApiError";

import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "@/types/token.types";

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
    issuer: "novashop",
    audience: "novashop-users",
    algorithm: "HS256",
  });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
    issuer: "novashop",
    audience: "novashop-users",
    algorithm: "HS256",
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET, {
      issuer: "novashop",
      audience: "novashop-users",
      algorithms: ["HS256"],
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.sessionId !== "string" ||
      (decoded.role !== "user" && decoded.role !== "admin") ||
      decoded.tokenType !== "access"
    ) {
      throw new Error("Invalid access-token payload");
    }
    return {
      sub: decoded.sub,
      sessionId: decoded.sessionId,
      role: decoded.role,
      tokenType: decoded.tokenType,
    };
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }
}
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET, {
      issuer: "novashop",
      audience: "novashop-users",
      algorithms: ["HS256"],
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.sessionId !== "string" ||
      decoded.tokenType !== "refresh"
    ) {
      throw new Error("Invalid refresh-token payload");
    }

    return {
      sub: decoded.sub,
      sessionId: decoded.sessionId,
      tokenType: decoded.tokenType,
    };
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
}
