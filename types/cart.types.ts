import type { Product } from "@/types/products.types";

export type CartItem = Product & {
  quantity: number;
};
