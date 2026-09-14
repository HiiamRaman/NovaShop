"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import { useCartStore } from "@/store/cartStore";

export default function LogoutButton() {
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      // Ask the backend to remove authentication cookies.
      await api.post("/api/auth/logout");

      // Avoid showing one customer's cart to another user.
      clearCart();

      toast.success("Logged out successfully");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to log out";

      toast.error("Logout failed", {
        description: message,
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoggingOut ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      )}
    </button>
  );
}
