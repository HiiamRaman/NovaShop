import type { Metadata } from "next";

import EditProductContent from "@/components/admin/products/edit/EditProductContent";

export const metadata: Metadata = {
  title: "Edit Product | NovaShop Admin",
};

interface EditProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;

  return <EditProductContent productId={productId} />;
}
