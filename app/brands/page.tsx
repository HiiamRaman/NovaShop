import type { Metadata } from "next";

import BrandsSection from "@/components/brands/BrandsSection";

export const metadata: Metadata = {
  title: "Featured Brands | NovaShop",
  description: "Discover featured technology brands available at NovaShop.",
};

export default function BrandsPage() {
  return (
    <main className="min-h-screen bg-white">
      <BrandsSection />
    </main>
  );
}
