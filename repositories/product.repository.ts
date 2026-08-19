import { Product } from "@/models/Product.model";
import { getProductById } from "@/services/product.service";

import type {
  CreateProductData,
  ProductPaginationOptions,
  PublicProductQueryOptions,
  ProductSortOption,
} from "@/types/products.types";

export async function findProductBySlug(slug: string) {
  return Product.findOne({ slug });
}
export async function findProductBySku(sku: string) {
  return Product.findOne({ sku });
}

export async function createProduct(data: CreateProductData) {
  return Product.create(data);
}

export async function findProducts(options: ProductPaginationOptions) {
  const { skip, limit } = options;
  return Product.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

export async function countProducts(): Promise<number> {
  return Product.countDocuments({ isDeleted: false });
}

export async function buildPublicProductFilter(
  options: PublicProductQueryOptions
) {
  const filter: Record<string, unknown> = {
    status: "active",
    isDeleted: false,
  };
  if (options.search) {
    filter.$text = {
      $search: options.search,
    };
  }
  if (options.categoryId) {
    filter.category = options.categoryId;
  }

  if (options.brand) {
    filter.brand = {
      $regex: `^${options.brand}$`,
      $options: "i",
    };
  }

  return filter;
}

function buildProductSort(sort: ProductSortOption): Record<string, 1 | -1> {
  if (sort === "price-low-to-high") {
    return { priceInMinorUnit: 1 };
  }
  if (sort === "price-high-to-low") {
    return { priceInMinorUnit: -1 };
  }
  if (sort === "name-a-to-z") {
    return { name: 1 };
  }
  return { createdAt: -1 };
}

export async function findActiveProducts(options: PublicProductQueryOptions) {
  const filter = await buildPublicProductFilter(options);
  const sort = buildProductSort(options.sort);
  return Product.find(filter)
    .sort(sort)
    .skip(options.skip)
    .limit(options.limit);
}


export async function CountActiveProducts(
  options: PublicProductQueryOptions
): Promise<number> {
  const filter =  await  buildPublicProductFilter(options);

  return Product.countDocuments(filter);
}

export async function updateProductStatusById(
  productId: string,
  status: "draft" | "active" | "archived"
) {
  return Product.findByIdAndUpdate(
    {
      _id: productId,
      isDelted: false,
    },
    {
      $set: { status },
    },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function findActiveProductBySlug(slug: string) {
  return Product.findOne({
    slug,
    status: "active",
    isDeleted: false,
  });
}

export async function updateProductStockById(productId: string, stock: number) {
  return Product.findOneAndUpdate(
    {
      _id: productId,
      isDeleted: false,
    },
    {
      $set: {
        stock,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
}
