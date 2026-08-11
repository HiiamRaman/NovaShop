import { boolean, z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must contain at least 2 characters")
    .max(80, "Category name cannot exceed 80 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .default(""),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const UpdateCategoryStatusSchema = z.object({
  isActive: z.boolean({ message: "isActive must be true or false" }),
});

export type UpdateCategoryStatusInput = z.infer<
  typeof UpdateCategoryStatusSchema
>;

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must contain at least 2 characters")
      .max(80, "Category name cannot exceed 80 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "Provide at least one field to update",
  });
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
