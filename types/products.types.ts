export type ProductCurrency = "NPR" | "USD";

export type ProductStatus = "draft" | "active" | "archived";

export interface ProductImageData {
  url: string;
  publicId: string;
  alt: string;
  position: number;
}

/*
Public product returned to customer pages.

Used by:
- ProductCard
- Product details
- Cart
- Featured products
*/
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  categoryId: string;
  priceInMinorUnit: number;
  currency: ProductCurrency;
  stock: number;
  images: ProductImageData[];
}

/*
Admin products contain extra management fields.

Used by:
- Admin products table
- Admin product details
- Product editing
*/
export interface AdminProduct extends Product {
  sku: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

// Data used internally when creating a product.
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

// MongoDB pagination input.
export interface ProductPaginationOptions {
  skip: number;
  limit: number;
}

export type ProductSortOption =
  "newest" | "price-low-to-high" | "price-high-to-low" | "name-a-to-z";

export interface PublicProductQueryOptions {
  skip: number;
  limit: number;
  search?: string;
  categoryId?: string;
  brand?: string;
  sort: ProductSortOption;
}

// Data used internally when updating a product.
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

// Pagination returned by public and admin APIs.
export interface ProductPagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

// Data returned by GET /api/products.
export interface ProductsResponseData {
  products: Product[];
  pagination: ProductPagination;
}

// Data returned by GET /api/admin/products.
export interface AdminProductsResponseData {
  products: AdminProduct[];
  pagination: ProductPagination;
}
