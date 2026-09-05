import { z } from "zod";
export const createAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must contain at least 2 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must contain at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  city: z.string().trim().min(2, "City must contain at least 2 characters"),
  address: z
    .string()
    .trim()
    .min(5, "Address must contain at least 5 characters"),
  isDefault: z.boolean().optional(),
});
