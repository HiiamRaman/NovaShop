import { getProductById } from "@/services/product.service";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
interface ProductDetailProp {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailProp): Promise<Metadata> {
  const { id } = await params;

  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }

  return {
    title: `${product.title} | NovaShop`,
    description: product.description,
  };
}

async function ProductDetailsPage({ params }: ProductDetailProp) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Visual Area */}
        <ProductGallery product={product} />

        {/* Right Column: Product Information */}
        <ProductInfo product={product} />
      </div>
    </div>
  );
}

export default ProductDetailsPage;
