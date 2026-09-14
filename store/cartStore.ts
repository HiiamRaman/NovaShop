import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/types/cart.types";
import type { Product } from "@/types/products.types";

interface CartStore {
  cart: CartItem[];

  addToCart: (
    product: Product,
    quantity: number
  ) => void;

  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (product, quantity) => {
        set((state) => {
          // Validate product stock before using it.
          const availableStock = Number.isFinite(
            product.stock
          )
            ? product.stock
            : 0;

          if (availableStock <= 0) {
            return state;
          }

          // Validate the quantity received from the component.
          const requestedQuantity =
            Number.isFinite(quantity) && quantity > 0
              ? Math.floor(quantity)
              : 1;

          const existingItem = state.cart.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            const updatedCart = state.cart.map(
              (item) => {
                if (item.id !== product.id) {
                  return item;
                }

                // Protect against corrupted persisted quantity.
                const currentQuantity =
                  Number.isFinite(item.quantity) &&
                  item.quantity > 0
                    ? item.quantity
                    : 1;

                const itemStock =
                  Number.isFinite(item.stock) &&
                  item.stock > 0
                    ? item.stock
                    : availableStock;

                const updatedQuantity = Math.min(
                  currentQuantity + requestedQuantity,
                  itemStock
                );

                return {
                  ...item,

                  // Refresh product information when it is
                  // added to the cart again.
                  ...product,

                  quantity: updatedQuantity,
                };
              }
            );

            return {
              cart: updatedCart,
            };
          }

          const safeQuantity = Math.min(
            requestedQuantity,
            availableStock
          );

          // A cart item contains all product fields plus quantity.
          const newItem: CartItem = {
            ...product,
            quantity: safeQuantity,
          };

          return {
            cart: [...state.cart, newItem],
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => item.id !== id
          ),
        }));
      },

      increaseQuantity: (id) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id !== id) {
              return item;
            }

            const currentQuantity =
              Number.isFinite(item.quantity) &&
              item.quantity > 0
                ? item.quantity
                : 1;

            const availableStock =
              Number.isFinite(item.stock) &&
              item.stock > 0
                ? item.stock
                : currentQuantity;

            return {
              ...item,

              // Never increase beyond available stock.
              quantity: Math.min(
                currentQuantity + 1,
                availableStock
              ),
            };
          }),
        }));
      },

      decreaseQuantity: (id) => {
        set((state) => {
          const updatedCart = state.cart
            .map((item) => {
              if (item.id !== id) {
                return item;
              }

              const currentQuantity =
                Number.isFinite(item.quantity) &&
                item.quantity > 0
                  ? item.quantity
                  : 1;

              return {
                ...item,
                quantity: currentQuantity - 1,
              };
            })

            // Remove the item when quantity reaches zero.
            .filter((item) => item.quantity > 0);

          return {
            cart: updatedCart,
          };
        });
      },

      clearCart: () => {
        set({
          cart: [],
        });
      },
    }),

    {
      /*
       * UPDATED:
       * Using a new storage key prevents Zustand from loading
       * cart items saved with title, price and thumbnail.
       */
      name: "novashop-cart-v2",
    }
  )
);
