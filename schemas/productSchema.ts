import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must contain at least 2 characters")
    .max(150, "Product name cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must contain at least 10 characters")
    .max(5000, "Description cannot exceed 5000 characters"),

  brand: z
    .string()
    .trim()
    .min(2, "Brand must contain at least 2 characters")
    .max(80, "Brand cannot exceed 80 characters"),

  categoryId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid category ID"),

  sku: z
    .string()
    .trim()
    .min(2, "SKU is required")
    .max(100, "SKU cannot exceed 100 characters"),

  priceInMinorUnit: z.coerce
    .number()
    .int("Price must be a whole number")
    .min(0, "Price cannot be negative"),

  currency: z.enum(["NPR", "USD"]).default("USD"),


});

export type CreateProductInput = z.infer<typeof createProductSchema>;
