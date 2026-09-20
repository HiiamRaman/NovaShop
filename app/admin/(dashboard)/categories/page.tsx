import type { Metadata } from "next";

import AdminCategoriesContent from "@/components/admin/categories/AdminCategoriesContent";

export const metadata: Metadata = {
  title: "Categories | NovaShop Admin",
  description:
    "Create and manage NovaShop product categories.",
};

export default function AdminCategoriesPage() {
  return <AdminCategoriesContent />;
}
