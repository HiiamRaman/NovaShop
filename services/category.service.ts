import mongoose from "mongoose";
import {
  createCategory,
  findCategoryByName,
  findCategoryBySlug,
  findAllCategories,
  findActiveCategories,
  updateCategorystatus,
  updateCategoryById,
  findCategoryById,
} from "@/repositories/category.repository";
import {
  CreateCategoryInput,
  UpdateCategoryStatusInput,
  UpdateCategoryInput,
} from "@/schemas/categorySchema";
import { CreateCategoryData, UpdateCategoryData } from "@/types/category.types";
import { ApiError } from "@/utils/ApiError";
import { createSlug } from "@/utils/createSlug";

export async function addCategory(data: CreateCategoryInput) {
  const { name, description } = data;

  // Convert "Mobile Phones" into "mobile-phones"
  const slug = createSlug(name);

  // Ensure the name can produce a valid slug
  if (!slug) {
    throw new ApiError(400, "Invalid category name");
  }

  // Prevent duplicate category names
  const existingName = await findCategoryByName(name);

  if (existingName) {
    throw new ApiError(409, "Category name already exists");
  }

  // Prevent duplicate URL slugs
  const existingSlug = await findCategoryBySlug(slug);

  if (existingSlug) {
    throw new ApiError(409, "Category slug already exists");
  }

  // Prepare database-ready data
  const categoryData: CreateCategoryData = {
    name,
    slug,
    description,
  };

  // Repository communicates with MongoDB
  const category = await createCategory(categoryData);

  // Return only the fields required by the API
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
  };
}
export async function getAllCategories() {
  const categories = await findAllCategories();
  return categories.map((category) => ({
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }));
}
export async function getActiveCategories() {
  const categories = await findActiveCategories();
  return categories.map((category) => ({
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
  }));
}
export async function changeCategoryStatus(
  categoryId: string,
  data: UpdateCategoryStatusInput
) {
  // Prevent Mongoose CastError for an invalid ObjectId
  if (!mongoose.isValidObjectId(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }
  //update status

  const category = await updateCategorystatus(categoryId, data.isActive);

  if (!category) {
    throw new ApiError(404, "category not found");
  }

  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
  };
}
export async function editCategory(
  categoryId: string,
  data: UpdateCategoryInput
) {
  // Prevent a Mongoose CastError
  if (!mongoose.isValidObjectId(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  // Find the existing category
  const currentCategory = await findCategoryById(categoryId);

  if (!currentCategory) {
    throw new ApiError(404, "Category not found");
  }

  // Contains only fields that should be changed
  const updateData: UpdateCategoryData = {};

  // Update description only when it was provided
  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  // Regenerate the slug only when the name changes
  if (
    data.name !== undefined &&
    data.name !== currentCategory.name
  ) {
    const newSlug = createSlug(data.name);

    if (!newSlug) {
      throw new ApiError(400, "Invalid category name");
    }

    const categoryWithName = await findCategoryByName(data.name);

    if (
      categoryWithName &&
      categoryWithName._id.toString() !== categoryId
    ) {
      throw new ApiError(409, "Category name already exists");
    }

    const categoryWithSlug = await findCategoryBySlug(newSlug);

    if (
      categoryWithSlug &&
      categoryWithSlug._id.toString() !== categoryId
    ) {
      throw new ApiError(409, "Category slug already exists");
    }

    updateData.name = data.name;
    updateData.slug = newSlug;
  }

  const updatedCategory = await updateCategoryById(
    categoryId,
    updateData
  );

  if (!updatedCategory) {
    throw new ApiError(404, "Category not found");
  }

  return {
    id: updatedCategory._id.toString(),
    name: updatedCategory.name,
    slug: updatedCategory.slug,
    description: updatedCategory.description,
    isActive: updatedCategory.isActive,
  };
}
