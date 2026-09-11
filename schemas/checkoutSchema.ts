import { z } from "zod";

export const checkoutAddressInputSchema  = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters"),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City is required"),
});

export type CheckoutAddressInput  = z.infer<
  typeof checkoutAddressInputSchema
>;


export const validateCheckoutSchema = z.object({
  addressId: z
    .string()
    .trim()
    .min(1, "Address ID is required"),

  items: z
    .array(
      z.object({
        productId: z
          .string()
          .trim()
          .min(1, "Product ID is required"),

        quantity: z
          .number()
          .int("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Your cart is empty"),
});



export const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, "Name must be at least 3 characters"),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  city: z.string().trim().min(2, "City is required"),
  isDefault: z.boolean(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
