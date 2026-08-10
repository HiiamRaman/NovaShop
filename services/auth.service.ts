import {
  findUserByEmail,
  createUser,
  findUserById,
} from "@/repositories/user.repository";
import { hashPassword } from "@/lib/bcrypt";
import type { SignupFormData } from "@/schemas/signupSchema";
import { ApiError } from "@/utils/ApiError";
import { findUserByEmailWithPassword } from "@/repositories/user.repository";
import type { LoginFormData } from "@/schemas/loginSchema";
import { comparePassword } from "@/lib/bcrypt";
import type { SessionMetadata } from "@/types/session.types";
import { hashToken } from "@/lib/tokenhash";
import {
  createSession,
  findActiveSessionById,
  revokeSessionById,
  revokeUserSessionById,
  rotateSessionRefreshToken,
  findActiveSessionsByUserId,
  revokeAllSessionsByUserId,
} from "@/repositories/session.repository";
import { randomUUID } from "node:crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/lib/jwt";
import { env } from "@/lib/env";

export async function registerUser(data: SignupFormData) {
  const { fullName, email, password } = data;
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "user already exists");
  }
  const hashedPassword = await hashPassword(password);
  const user = await createUser({
    fullName,
    email,
    password: hashedPassword,
  });
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

export async function loginUser(
  data: LoginFormData,
  metadata: SessionMetadata
) {
  const { email, password } = data;

  // Fetch user including the hidden password field
  const user = await findUserByEmailWithPassword(email);

  // Use a generic message to prevent account discovery
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const userId = user._id.toString();
  const sessionId = randomUUID();

  // Compare plain password with the stored bcrypt hash
  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken({
    sub: userId,
    sessionId,
    role: user.role,
    tokenType: "access",
  });
  const refreshToken = generateRefreshToken({
    sub: userId,
    sessionId,
    tokenType: "refresh",
  });

  const refreshTokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRY * 1000);
  await createSession({
    sessionId,
    userId,
    refreshTokenHash,
    userAgent: metadata.userAgent,
    expiresAt,
  });
  // Return only safe user information
  return {
    user: {
      id: userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}
export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(401, "Invalid Authentication");
  }

  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}
export async function refreshAuthSession(receivedRefreshToken: string) {
  // Verify signature, expiration and token payload
  const payload = verifyRefreshToken(receivedRefreshToken);

  // Hash the token received from the cookie
  const currentTokenHash = hashToken(receivedRefreshToken);

  // Find its exact active session
  const session = await findActiveSessionById(payload.sessionId);

  if (!session || session.userId.toString() !== payload.sub) {
    throw new ApiError(401, "Invalid refresh session");
  }

  // Detect an old or replaced refresh token
  if (session.refreshTokenHash !== currentTokenHash) {
    await revokeSessionById(payload.sessionId);

    throw new ApiError(401, "Invalid refresh session");
  }

  // Retrieve current user information and current role
  const user = await findUserById(payload.sub);

  if (!user) {
    await revokeSessionById(payload.sessionId);

    throw new ApiError(401, "Invalid refresh session");
  }

  const newAccessToken = generateAccessToken({
    sub: payload.sub,
    sessionId: payload.sessionId,
    role: user.role,
    tokenType: "access",
  });

  const newRefreshToken = generateRefreshToken({
    sub: payload.sub,
    sessionId: payload.sessionId,
    tokenType: "refresh",
  });

  const newRefreshTokenHash = hashToken(newRefreshToken);

  // Sliding session: active sessions receive another 7 days
  const newExpiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRY * 1000);

  // Replace the old hash only if it is still current
  const rotatedSession = await rotateSessionRefreshToken(
    payload.sessionId,
    currentTokenHash,
    newRefreshTokenHash,
    newExpiresAt
  );

  if (!rotatedSession) {
    // Another request may already have used this token
    await revokeSessionById(payload.sessionId);

    throw new ApiError(401, "Invalid refresh session");
  }

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
export async function logoutSession(receivedRefreshToken: string) {
  const payload = verifyRefreshToken(receivedRefreshToken);
  await revokeSessionById(payload.sessionId);
}
export async function logoutAllSessions(userId: string) {
  await revokeAllSessionsByUserId(userId);
}

export async function getUserSessions(
  userId: string,
  currentSessionId: string
) {
  const sessions = await findActiveSessionsByUserId(userId);
  return sessions.map((session) => {
    return { ...session, isCurrent: session.sessionId === currentSessionId };
  });
}

export async function removeUserSession(
  userId: string,
  targetSessionId: string,
  currentSessionId: string
) {
  if (targetSessionId === currentSessionId) {
    throw new ApiError(400, "Use logout to remove the current session");
  }
  const revokedSession = await revokeUserSessionById(userId, targetSessionId);
  if (!revokedSession) {
    throw new ApiError(400, "Active session not found");
  }
}
