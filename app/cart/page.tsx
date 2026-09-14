"use client";

import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Calculate the total quantity, not only the number of product rows.
  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  function handleClearCart() {
    clearCart();

    toast.success("Cart cleared", {
      description: "All products were removed from your cart.",
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <header className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShoppingCart className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Shopping Cart
              </h1>

              <p className="mt-1 text-slate-500">
                Review your items before checkout.
              </p>
            </div>
          </div>
        </header>

        {/* Empty cart */}
        {cart.length === 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ShoppingCart className="h-10 w-10" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Add some products to your cart and return here when you are ready
              to checkout.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
            >
              Browse Products
            </Link>
          </section>
        ) : (
          /* Cart content */
          <div className="grid items-start gap-8 lg:grid-cols-3">
            {/* Cart items */}
            <section className="space-y-5 lg:col-span-2">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}

              {/* Cart actions */}
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-slate-700">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </p>

                <button
                  type="button"
                  onClick={handleClearCart}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </button>
              </div>
            </section>

            {/* Order summary */}
            <aside className="h-fit lg:sticky lg:top-24">
              <CartSummary />
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
