import { z } from "zod";

export const signupSchema = z
  .object({
    fullname: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("please enter valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type signupFormData = z.infer<typeof signupSchema>;
