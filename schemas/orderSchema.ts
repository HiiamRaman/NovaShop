import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(["confirmed", "shipped", "delivered"]),
});

export type UpdateOrderStatusData = z.infer<typeof updateOrderStatusSchema>;
