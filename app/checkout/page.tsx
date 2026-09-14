import type { Metadata } from "next";

import CheckoutContent from "@/components/checkout/CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout | NovaShop",
  description:
    "Complete your NovaShop order securely.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <CheckoutContent />
    </main>
  );
}
