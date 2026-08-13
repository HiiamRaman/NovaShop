import { Product } from "@/models/Product.model";

import { CreateProductData } from "@/types/products.types";

export async function findProductBySlug(slug: string) {
  return Product.findOne({ slug });
}
export async function findProductBySku(sku: string) {
  return Product.findOne({ sku });
}

export async function createProduct(data: CreateProductData) {
  return Product.create(data);
}
