"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import { useCartStore } from "@/store/cartStore";

import SavedAddressSelector from "./SavedAddressSelector";

import type { CheckoutAddress } from "./SavedAddressSelector";

interface OrderResponse {
  id: string;
}

interface StripeResponse {
  checkoutUrl: string;
}

export default function CheckoutForm() {
  const cart = useCartStore((state) => state.cart);

  const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);

  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const response = await api.get("/api/addresses");

        const savedAddresses = response.data as CheckoutAddress[];

        setAddresses(savedAddresses);

        if (savedAddresses.length === 0) {
          setSelectedAddressId("");
          return;
        }

        // Check whether we returned from the new-address page.
        const searchParams = new URLSearchParams(window.location.search);

        const requestedAddressId = searchParams.get("addressId");

        // Find the address created on the new-address page.
        const requestedAddress = savedAddresses.find(
          (address) => address.id === requestedAddressId
        );

        // Selection priority:
        // 1. Newly created address
        // 2. Default address
        // 3. First saved address
        const selectedAddress =
          requestedAddress ??
          savedAddresses.find((address) => address.isDefault) ??
          savedAddresses[0];

        setSelectedAddressId(selectedAddress.id);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load addresses";

        toast.error("Could not load saved addresses", {
          description: message,
        });
      } finally {
        setIsLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, []);

  function handleAddressSelect(addressId: string) {
    setSelectedAddressId(addressId);
  }

  async function handleCheckout() {
    if (isSubmitting) {
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please add or select a shipping address");
      return;
    }

    try {
      setIsSubmitting(true);

      // Send only product IDs and quantities.
      // The backend verifies prices and stock.
      const checkoutData = {
        addressId: selectedAddressId,

        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      // Step 1: Verify address ownership, products,
      // prices and available stock.
      await api.post("/api/checkout/validate", checkoutData);

      // Step 2: Create a pending NovaShop order.
      const orderResponse = await api.post("/api/orders", checkoutData);

      const order = orderResponse.data as OrderResponse;

      if (!order.id) {
        throw new Error("Order ID was not returned");
      }

      // Step 3: Create the Stripe Checkout Session.
      const stripeResponse = await api.post("/api/payment/stripe/checkout", {
        orderId: order.id,
      });

      const stripeCheckout = stripeResponse.data as StripeResponse;

      if (!stripeCheckout.checkoutUrl) {
        throw new Error("Stripe checkout URL was not returned");
      }

      // Step 4: Leave NovaShop and open Stripe.
      window.location.assign(stripeCheckout.checkoutUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Checkout failed";

      toast.error("Unable to checkout", {
        description: message,
      });

      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <SavedAddressSelector
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        isLoading={isLoadingAddresses}
        onSelect={handleAddressSelect}
      />

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isSubmitting || isLoadingAddresses || addresses.length === 0}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CreditCard className="h-5 w-5" />

        {isSubmitting ? "Preparing payment..." : "Continue to payment"}
      </button>

      {addresses.length === 0 && !isLoadingAddresses && (
        <p className="mt-3 text-center text-sm text-amber-600">
          Add a shipping address before continuing.
        </p>
      )}

      <p className="mt-3 text-center text-xs text-slate-400">
        Product prices and stock will be verified securely before payment.
      </p>
    </section>
  );
}
