import { create } from "zustand";
import { CartItem } from "@/types/cart.types";
import { Product } from "@/types/products.types";


interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product, quantity:number) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (product,quantity) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        const updatedCart = state.cart.map((item) => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + quantity };
          } else {
            return item;
          }
        });
        return { cart: updatedCart };
      }
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity : quantity || 1,
      };


      return { cart: [...state.cart, newItem] };
    });
  },

  removeFromCart: (id) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => {
        return item.id !== id;
      });
      return { cart: updatedCart };
    });
  },
  increaseQuantity: (id) => {
    set((state) => {
      const updatedCart = state.cart.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      return { cart: updatedCart };
    });
  },
  decreaseQuantity: (id) => {
    set((state) => {
      const updatedCart = state.cart.map((item) => {
        if (item.id == id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });

      const filteredCart = updatedCart.filter((item) => item.quantity > 0);
      return { cart: filteredCart };
    });
  },

  clearCart:()=>{

    set(()=>{
        return {
            cart:[]
        }

    })

  }
}));
