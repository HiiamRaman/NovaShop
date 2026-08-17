export interface Product {
  id: number;
  title: string;
  description: string;
 category:string

  price: number;
  thumbnail: string;
  images: string[];
}
export interface ProductImageData {
  url: string;
  publicId: string;
  alt: string;
  position: number;
}

export type ProductCurrency = "NPR" | "USD";
export interface ProductImageData {
  url: string;
  publicId: string;
  alt: string;
  position: number;
}

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
