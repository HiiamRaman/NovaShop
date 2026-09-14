import type { Metadata } from "next";

import NewAddressFields from "@/components/checkout/NewAddressFields";

export const metadata: Metadata = {
  title: "Add Address | NovaShop",
  description:
    "Add a new NovaShop shipping address.",
};

export default function NewCheckoutAddressPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-12 sm:px-6">
      <NewAddressFields />
    </main>
  );
}
