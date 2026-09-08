import { z } from "zod";
export const createStripeCheckoutSchema = z.object({
  orderId: z.string().trim().min(1, "Order ID is required"),
});
