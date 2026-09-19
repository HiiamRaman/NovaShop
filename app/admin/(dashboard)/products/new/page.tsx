import type { Metadata } from "next";

import NewProductContent from "@/components/admin/products/new/NewProductContent";

export const metadata: Metadata = {
  title: "Add Product | NovaShop Admin",
};

export default function NewProductPage() {
  return <NewProductContent />;
}
