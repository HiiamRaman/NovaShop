import {
  CreateProductData,
  Product,
  ProductImageData,
  PublicProductQueryOptions,
} from "@/types/products.types";

import { findCategoryById } from "@/repositories/category.repository";
import {
  createProduct,
  findProductBySku,
  findProductBySlug,
} from "@/repositories/product.repository";
import { createSlug } from "@/utils/createSlug";
import { ApiError } from "@/utils/ApiError";
import {
  CreateProductInput,
  ProductListInput,
  UpdateProductStatusInput,
  UpdateProductStockInput,
} from "@/schemas/productSchema";
import {
  countProducts,
  findProducts,
  CountActiveProducts,
  findActiveProducts,
  updateProductStatusById,
  findActiveProductBySlug,
  updateProductStockById,
} from "@/repositories/product.repository";

import mongoose from "mongoose";

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
export async function getAdminProducts(query: ProductListInput) {
  const { page, limit } = query;
  // Calculate how many products MongoDB should skip
  const skip = (page - 1) * limit;
  // Run both independent database queries together
  const [products, totalProducts] = await Promise.all([
    findProducts({ skip, limit }),
    countProducts(),
  ]);
  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products: products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      categoryId: product.category.toString(),
      sku: product.sku,
      priceInMinorUnit: product.priceInMinorUnit,
      currency: product.currency,
      stock: product.stock,
      images: product.images,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    })),
    pagination: {
      currentPage: page,
      limit,
      totalProducts,
      totalPages,
    },
  };
}

export async function getPublicProducts(input: ProductListInput) {
  const { page, limit, search, categoryId, brand, sort } = input;
  // Convert page-based pagination into database skip
  const skip = (page - 1) * limit;
    // Prepare the options required by the repository
  const queryOptions: PublicProductQueryOptions = {
    skip,
    limit,
    search,
    categoryId,
    brand,
    sort,
  };
  // Fetch products and their total count simultaneously

  const [products, totalProducts] = await Promise.all([
    findActiveProducts(queryOptions),
    CountActiveProducts(queryOptions),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);
  return {
    products: products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      brand: product.brand,
      categoryId: product.category.toString(),
      priceInMinorUnit: product.priceInMinorUnit,
      currency: product.currency,
      stock: product.stock,
      images: product.images,
    })),
    pagination: {
      currentPage: page,
      limit,
      totalProducts,
      totalPages,
    },
  };
}

export async function changeProductStatus(
  productId: string,
  input: UpdateProductStatusInput
) {
  // Prevent an invalid ID from reaching MongoDB
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "invlaid Product Id");
  }

  const product = await updateProductStatusById(productId, input.status);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    status: product.status,
    updatedAt: product.updatedAt,
  };
}

export async function getPublicProductBySlug(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) {
    throw new ApiError(400, "Product slug is required");
  }
  const product = await findActiveProductBySlug(normalizedSlug);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

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
    stock: product.stock,
    images: product.images,
  };
}

export async function changeProductstock(
  productId: string,
  input: UpdateProductStockInput
) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product id ");
  }

  const product = await updateProductStockById(productId, input.stock);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return {
    id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    updatedAt: product.updatedAt,
  };
}
