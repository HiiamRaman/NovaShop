import { findUserByEmail, createUser } from "@/repositories/user.repository";
import { hashPassword } from "@/lib/bcrypt";
import type { SignupFormData } from "@/schemas/signupSchema";
import { ApiError } from "@/utils/ApiError";
import { findUserByEmailWithPassword } from "@/repositories/user.repository";
import type { LoginFormData } from "@/schemas/loginSchema";
import { comparePassword } from "@/lib/bcrypt";

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

export async function loginUser(data: LoginFormData) {
  const { email, password } = data;

  // Fetch user including the hidden password field
  const user = await findUserByEmailWithPassword(email);

  // Use a generic message to prevent account discovery
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare plain password with the stored bcrypt hash
  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Return only safe user information
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}
