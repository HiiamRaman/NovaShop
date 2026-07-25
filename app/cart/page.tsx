"use client";

import Link from "next/link";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cartStore";

function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="mt-2 text-gray-600">
            Review your items before checkout
          </p>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 && (
          <div className="rounded-2xl border bg-white/80 backdrop-blur-md p-10 text-center shadow-md">
            <div className="mb-4 text-6xl">🛒</div>
            <h2 className="text-2xl font-bold text-slate-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-gray-600">
              Add some amazing products and start shopping.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-105 hover:bg-emerald-700"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Cart Content */}
        {cart.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Side */}
            <div className="space-y-5 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-md rounded-xl"
                >
                  <CartItem item={item} />
                </div>
              ))}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm">
                <p className="font-semibold text-slate-700">
                  {totalItems} item{totalItems > 1 ? "s" : ""} in your cart
                </p>
                <button
                  onClick={clearCart}
                  className="rounded-full bg-red-500 px-6 py-3 font-medium text-white shadow-md transition hover:scale-105 hover:bg-red-600"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className="lg:sticky lg:top-24 h-fit">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
