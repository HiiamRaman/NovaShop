"use client";

import { Product } from "@/types/products.types";
import { useCartStore } from "@/store/cartStore";
interface AddToCartButtonProps {
  product: Product;
  quantity: number;
  onAdded?: () => void;
}

export default function AddToCartButton({
  product,
  quantity,
  onAdded,
}: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const handleClick = () => {
    addToCart(product, quantity);
    if (onAdded) onAdded();
  };

  return (
    <button
      onClick={handleClick}
      className="
       w-full sm:w-auto min-w-[200px] bg-black hover:bg-gray-900 text-white font-medium py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer text-center
      "
    >
      Add To Cart
    </button>
  );
}








