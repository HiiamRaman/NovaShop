import {
  CreateProductData,
  Product,
  ProductImageData,
} from "@/types/products.types";

import { findCategoryById } from "@/repositories/category.repository";
import {
  createProduct,
  findProductBySku,
  findProductBySlug,
} from "@/repositories/product.repository";
import { createSlug } from "@/utils/createSlug";
import { ApiError } from "@/utils/ApiError";
import { CreateProductInput } from "@/schemas/productSchema";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://dummyjson.com/products", {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error("Failed to Fetch Products");
  }
  const data = await res.json();

  return data.products;
}

export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error("Failed to Fetch Product");
  }

  const data = await res.json();
  return data;
}

export async function addProduct(
  data: CreateProductInput,
  images: ProductImageData[],
  adminUserId: string
) {
  //check whether the category exists
  const category = await findCategoryById(data.categoryId);
  if (!category) {
    throw new ApiError(400, "Category not found");
  }
  //prevent creating category inside inactive category
  if (!category.isActive) {
    throw new ApiError(400, "Cannot add product in inactive category");
  }
  // Generate the product URL slug from its name

  const slug = createSlug(data.name);
  if (!slug) {
    throw new ApiError(400, "Invalid product name");
  }

  // Ensure the product URL is unique
  const existingSlug = await findProductBySlug(slug);
  if (existingSlug) {
    throw new ApiError(400, "Product slug already exists");
  }

  // Store every SKU in the same uppercase format

  const normalizedSku = data.sku.toUpperCase();

  // Ensure the inventory identifier is unique
  const existingSku = await findProductBySku(normalizedSku);
  if (existingSku) {
    throw new ApiError(400, "Product sku already exists");
  }

  // Transform API input into database-ready data

  const productData: CreateProductData = {
    name: data.name,
    slug,
    description: data.description,
    brand: data.brand,
    category: data.categoryId,
    sku: normalizedSku,
    priceInMinorUnit: data.priceInMinorUnit,
    currency: data.currency,
    createdBy: adminUserId,
    images,
  };

  const product = await createProduct(productData);

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: product.brand,
    categoryId: product.category.toString(),
    sku: product.sku,
    priceInMinorUnit: product.priceInMinorUnit,
    currency: product.currency,

    images: product.images,
    status: product.status,
    createdBy: product.createdBy.toString(),
    createdAt: product.createdAt,
  };
}
