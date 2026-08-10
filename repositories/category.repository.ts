import { Category } from "@/models/Category.model";

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
}

export async function findCategoryByName(name: string) {
  return Category.findOne({ name });
}

export async function findCategoryBySlug(slug: string) {
  return Category.findOne({ slug });
}

export async function createCategory(data: CreateCategoryData) {
  return Category.create(data);
}
