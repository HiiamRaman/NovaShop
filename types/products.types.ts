export type ProductCurrency = "NPR" | "USD";

export interface ProductImageData {
  url: string;
  publicId: string;
  alt: string;
  position: number;
}

// Product returned by the NovaShop API
export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  description: string;
  sku: string;
  priceInMinorUnit: number;
  currency: ProductCurrency;
  stock: number;
  images: ProductImageData[];
  status: "draft" | "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Data used internally when creating a product
export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  sku: string;
  priceInMinorUnit: number;
  currency: ProductCurrency;
  createdBy: string;
  images?: ProductImageData[];
}

// MongoDB pagination input
export interface ProductPaginationOptions {
  skip: number;
  limit: number;
}

export type ProductSortOption =
  | "newest"
  | "price-low-to-high"
  | "price-high-to-low"
  | "name-a-to-z";

export interface PublicProductQueryOptions {
  skip: number;
  limit: number;
  search?: string;
  categoryId?: string;
  brand?: string;
  sort: ProductSortOption;
}

// Data used internally when updating a product
export interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  brand?: string;
  category?: string;
  sku?: string;
  priceInMinorUnit?: number;
  currency?: ProductCurrency;
}

// Pagination returned by the API
export interface ProductPagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

// Complete data property returned by GET /api/admin/products
export interface ProductsResponseData {
  products: Product[];
  pagination: ProductPagination;
}
