import type { Metadata } from "next";

import ProductImagesContent from "@/components/admin/products/images/ProductImagesContent";

export const metadata: Metadata = {
  title: "Manage Product Images | NovaShop Admin",
};

interface ProductImagesPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductImagesPage({
  params,
}: ProductImagesPageProps) {
  const { productId } = await params;

  return <ProductImagesContent productId={productId} />;
}
