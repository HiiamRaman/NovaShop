import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import { env } from "@/lib/env";
import type { Product } from "@/types/products.types";

/*
The dynamic folder is:

app/products/[slug]/page.tsx

Therefore, Next.js gives us a string called `slug`.

Example:
URL  = /products/samsung-galaxy-s25-ultra-5g
slug = samsung-galaxy-s25-ultra-5g
*/
interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/*
This describes the response returned by:

GET /api/products/:slug
*/
interface ProductApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Product;
}

/*
Fetch one product using the existing public API.

Because this function runs on the server, fetch uses the
complete URL:

http://localhost:3000/api/products/:slug
*/
async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetch(
    `${env.APP_URL}/api/products/${encodeURIComponent(slug)}`,
    {
      /*
      Always request fresh product information.

      This helps prevent an old price or stock value from
      being displayed from the Next.js cache.
      */
      cache: "no-store",
    }
  );

  /*
  A 404 response means the product does not exist,
  is deleted, or is not active.
  */
  if (response.status === 404) {
    return null;
  }

  /*
  Handle other API failures such as 500.
  */
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const result = (await response.json()) as ProductApiResponse;

  return result.data;
}

/*
Generate the browser-tab title and page description
using the real product data.
*/
export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | NovaShop",
      description: "The requested product could not be found.",
    };
  }

  return {
    /*
    NovaShop uses `name`, not the old `title` field.
    */
    title: `${product.name} | NovaShop`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  /*
  Read the slug directly.

  Do not use Number(slug), because a slug is text.
  */
  const { slug } = await params;

  /*
  Fetch the product from the existing API.
  */
  const product = await fetchProductBySlug(slug);

  /*
  Show Next.js's not-found page when the API returns 404.
  */
  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 lg:gap-16">
        {/* Display all Cloudinary product images */}
        <ProductGallery product={product} />

        {/* Display name, price, stock and cart action */}
        <ProductInfo product={product} />
      </div>
    </main>
  );
}
