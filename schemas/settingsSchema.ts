import { z } from "zod";

export const updateSettingsSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(2, "Store name is required"),

  supportEmail: z.email("Enter a valid support email"),

  supportPhone: z
    .string()
    .trim()
    .min(7, "Enter a valid support phone"),

  currency: z.enum(["NPR", "USD"]),

  newOrderNotifications: z.boolean(),

  paymentNotifications: z.boolean(),

  lowStockNotifications: z.boolean(),
});

export type UpdateSettingsData = z.infer<
  typeof updateSettingsSchema
>;
