import {
  CreateProductData,
  Product,
  ProductImageData,
  PublicProductQueryOptions,
  UpdateProductData,
} from "@/types/products.types";

import { findCategoryById } from "@/repositories/category.repository";
import {
  createProduct,
  findProductBySku,
  findProductBySlug,
  removeProductImageByPublicId,
  updateProductImagesOrder,
} from "@/repositories/product.repository";

import { ApiError } from "@/utils/ApiError";
import {
  CreateProductInput,
  ProductListInput,
  UpdateProductStatusInput,
  UpdateProductStockInput,
  updateProductInput,
} from "@/schemas/productSchema";
import {
  countProducts,
  findProducts,
  countActiveProducts,
  findActiveProducts,
  updateProductStatusById,
  findActiveProductBySlug,
  updateProductStockById,
  updateProductById,
  softDeleteProductById,
  restoreProductById,
  findProductById,
  appendProductImages,
} from "@/repositories/product.repository";
import { createSlug } from "@/utils/createSlug";
import mongoose from "mongoose";
import {
  uploadImage,
  deleteProductImages,
  uploadProductImages,
} from "@/lib/uploadImage";
import { MAX_IMAGE_COUNT } from "@/utils/validateProductImages";
import { deleteImage } from "@/lib/uploadImage";
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
    countActiveProducts(queryOptions),
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
export async function editProduct(
  productId: string,
  input: updateProductInput
) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid ProductId");
  }
  const updateData: UpdateProductData = {};

  // A name change also requires a new unique slug
  if (input.name !== undefined) {
    const slug = createSlug(input.name);
    const productWithSlug = await findProductBySlug(slug);

    if (productWithSlug && productWithSlug._id.toString() !== productId) {
      throw new ApiError(409, "Product slug already exists");
    }
    updateData.name = input.name;
    updateData.slug = slug;
  }

  if (input.description !== undefined) {
    updateData.description = input.description;
  }
  if (input.brand !== undefined) {
    updateData.brand = input.brand;
  }

  if (input.categoryId !== undefined) {
    const category = await findCategoryById(input.categoryId);
    if (!category || !category.isActive) {
      throw new ApiError(404, "Invalid or inactive category");
    }

    updateData.category = input.categoryId;
  }
  if (input.sku !== undefined) {
    const normalizedSku = input.sku.toUpperCase();
    const productWithSku = await findProductBySku(normalizedSku);
    if (productWithSku && productWithSku._id.toString() !== productId) {
      throw new ApiError(400, "Product SKU already exists");
    }
    updateData.sku = normalizedSku;
  }

  if (input.priceInMinorUnit !== undefined) {
    updateData.priceInMinorUnit = input.priceInMinorUnit;
  }

  if (input.currency !== undefined) {
    updateData.currency = input.currency;
  }

  const product = await updateProductById(productId, updateData);

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
    status: product.status,
    images: product.images,
    updatedAt: product.updatedAt,
  };
}

export async function removeProduct(productId: string) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product id");
  }

  //delete product

  const product = await softDeleteProductById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found or already deleted");
  }

  return {
    id: product._id.toString(),
    name: product.name,
    status: product.status,
    isDeleted: product.isDeleted,
  };
}

export async function restoreProduct(productId: string) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Productid");
  }
  const product = await restoreProductById(productId);

  if (!product) {
    throw new ApiError(404, "deleted product not found");
  }
  return {
    id: product._id.toString(),
    name: product.name,
    status: product.status,
    isDeleted: product.isDeleted,
  };
}
export async function addProductImages(productId: string, files: File[]) {
  //prevent mongoose castError
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }
  // Find the product receiving the images

  const product = await findProductById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Count existing and incoming images
  const totalImages = product.images.length + files.length;

  if (totalImages > MAX_IMAGE_COUNT) {
    throw new ApiError(
      400,
      `a product can have maximum ${MAX_IMAGE_COUNT} images`
    );
  }
  //continue images after exixsting image

  const startingPosition = product.images.length + 1;
  //upload new images in cloudinary
  const uploadedImages = await uploadProductImages(files, startingPosition);
  try {
    // Append uploaded image information to MongoDB
    const updatedProduct = await appendProductImages(productId, uploadedImages);
    if (!updatedProduct) {
      throw new ApiError(404, "product not found");
    }

    return {
      id: updatedProduct._id.toString(),
      images: updatedProduct.images,
    };
  } catch (error) {
    await deleteProductImages(uploadedImages);
    throw error;
  }
}

export async function removeProductImage(productId: string, publicId: string) {
  /*
Mental model:
1. Validate the product ID
2. Find the active product
3. Confirm the image belongs to the product
4. Remove the image information from MongoDB
5. Delete the actual image from Cloudinary
6. Return the updated product images
*/
  // Prevent an invalid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  // Confirm that the product exists
  const product = await findProductById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Confirm that this image belongs to the product
  const imageExists = product.images.some(
    (image: ProductImageData) => image.publicId === publicId
  );

  if (!imageExists) {
    throw new ApiError(404, "Product image not found");
  }

  // Remove the image information from MongoDB first
  const updatedProduct = await removeProductImageByPublicId(
    productId,
    publicId
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product image not found");
  }

  try {
    // Remove the actual image file from Cloudinary
    await deleteImage(publicId);
  } catch (error) {
    // Prevent a broken product image if Cloudinary cleanup fails
    console.error("Failed to delete Cloudinary image:", error);
  }

  return {
    id: updatedProduct._id.toString(),
    images: updatedProduct.images,
  };
}

/*
Mental model:
1. Validate the product ID
2. Find the non-deleted product
3. Ensure every existing image ID was provided
4. Arrange the images in the requested order
5. Assign positions starting from 1
6. Save and return the reordered images
*/
export async function reorderProductImages(
  productId: string,
  publicIds: string[]
) {
  // Prevent a Mongoose CastError.
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  // Get the product with its current images.
  const product = await findProductById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // The request must include every existing image.
  if (publicIds.length !== product.images.length) {
    throw new ApiError(400, "You must provide every existing product image");
  }

  // Process the requested IDs one by one.
  const reorderedImages = publicIds.map((publicId, index) => {
    // Find the complete image belonging to the current ID.
    const image = product.images.find(
      (existingImage: ProductImageData) => existingImage.publicId === publicId
    );

    // Reject an ID that does not belong to this product.
    if (!image) {
      throw new ApiError(
        400,
        `Image does not belong to this product: ${publicId}`
      );
    }

    // Preserve image data and assign its new position.
    return {
      url: image.url,
      publicId: image.publicId,
      alt: image.alt,
      position: index + 1,
    };
  });

  // Replace the existing images array in MongoDB.
  const updatedProduct = await updateProductImagesOrder(
    productId,
    reorderedImages
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return {
    id: updatedProduct._id.toString(),
    images: updatedProduct.images,
  };
}
