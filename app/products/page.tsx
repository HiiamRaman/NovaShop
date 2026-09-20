import ProductCatalog from "@/components/product/catalog/ProductCatalog";

import { env } from "@/lib/env";
import { buildProductQuery } from "@/utils/productQuery";

import type { PublicCategory } from "@/types/category.types";
import type {
  ProductsResponseData,
} from "@/types/products.types";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

interface ProductsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ProductsResponseData;
}

interface CategoriesApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: PublicCategory[];
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const query = buildProductQuery(
    params
  );

  const productsUrl =
    `${env.APP_URL}/api/products?${query.toString()}`;

  const categoriesUrl =
    `${env.APP_URL}/api/categories`;

  const [
    productsResponse,
    categoriesResponse,
  ] = await Promise.all([
    fetch(productsUrl, {
      cache: "no-store",
    }),

    fetch(categoriesUrl, {
      cache: "no-store",
    }),
  ]);

  if (!productsResponse.ok) {
    const responseBody =
      await productsResponse.text();

    console.error(
      "Product API request failed",
      {
        url: productsUrl,
        status: productsResponse.status,
        responseBody,
      }
    );

    throw new Error(
      `Failed to fetch products (${productsResponse.status})`
    );
  }

  if (!categoriesResponse.ok) {
    const responseBody =
      await categoriesResponse.text();

    console.error(
      "Category API request failed",
      {
        url: categoriesUrl,
        status:
          categoriesResponse.status,
        responseBody,
      }
    );

    throw new Error(
      `Failed to fetch categories (${categoriesResponse.status})`
    );
  }

  const productsResult =
    (await productsResponse.json()) as ProductsApiResponse;

  const categoriesResult =
    (await categoriesResponse.json()) as CategoriesApiResponse;

  return (
    <ProductCatalog
      products={
        productsResult.data.products
      }
      pagination={
        productsResult.data.pagination
      }
      categories={
        categoriesResult.data
      }
      search={params.search}
      category={params.category}
      sort={params.sort}
    />
  );
}
