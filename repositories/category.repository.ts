import { Category } from "@/models/Category.model";

import type {
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category.types";

export async function findCategoryByName(name: string) {
  return Category.findOne({ name });
}

export async function findCategoryBySlug(slug: string) {
  return Category.findOne({ slug });
}

export async function createCategory(data: CreateCategoryData) {
  return Category.create(data);
}

export async function findAllCategories() {
  return await Category.find()
    .select("name slug description isActive createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
}
export async function findActiveCategories() {
  return await Category.find({ isActive: true })
    .select("name slug description")
    .sort({ name: 1 })
    .lean();
}

export async function findCategoryById(categoryId: string) {
  return Category.findById(categoryId);
}

export async function updateCategorystatus(
  categoryId: string,
  isActive: boolean
) {
  return Category.findByIdAndUpdate(
    categoryId,
    { isActive },
    { new: true, runValidators: true }
  );
}

export async function updateCategoryById(
  categoryId: string,
  data: UpdateCategoryData
) {
  return Category.findByIdAndUpdate(
    categoryId,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}
