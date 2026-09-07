import {z} from 'zod'
export const checkoutSchema = z.object({
  addressId: z.string().trim().min(1, "Address ID is required"),

  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1, "Product ID is required"),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Your cart is empty"),
});
