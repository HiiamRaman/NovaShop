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

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().min(1).optional(),
  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
    .optional(),
  brand: z.string().trim().min(1).optional(),
  sort: z
    .enum(["newest", "price-low-to-high", "price-high-to-low", "name-a-to-z"])
    .default("newest"),
});

export type ProductListInput = z.infer<typeof productListQuerySchema>;

export const updateProductStatusSchema = z.object({
  status: z.enum(["draft", "active", "archived"]),
});
export type UpdateProductStatusInput = z.infer<
  typeof updateProductStatusSchema
>;

export const updateProductStockSchema = z.object({
  stock: z
    .number()
    .int("stock must be number ")
    .min(0, "Stock cannot be negative"),
});
export type UpdateProductStockInput = z.infer<typeof updateProductStockSchema>;

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(2).max(50).optional(),
    description: z.string().trim().max(500).optional(),
    brand: z.string().trim().min(1).optional(),

    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
      .optional(),
    sku: z.string().trim().min(1).optional(),
    priceInMinorUnit: z.number().int().min(0).optional(),
    currency: z.enum(["NPR", "USD"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type updateProductInput = z.infer<typeof updateProductSchema>;
