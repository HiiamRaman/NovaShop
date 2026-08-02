import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.email("please enter valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
