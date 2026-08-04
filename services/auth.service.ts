import { findUserByEmail, createUser } from "@/repositories/user.repository";
import { hashPassword } from "@/lib/bcrypt";
import type { SignupFormData } from "@/schemas/signupSchema";
import { ApiError } from "@/utils/ApiError";
import { findUserByEmailWithPassword } from "@/repositories/user.repository";
import type { LoginFormData } from "@/schemas/loginSchema";
import { comparePassword } from "@/lib/bcrypt";
import type { SessionMetadata } from "@/types/session.types";
import { hashToken } from "@/lib/tokenhash";
import { createSession } from "@/repositories/session.repository";
import { randomUUID } from "node:crypto";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
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
