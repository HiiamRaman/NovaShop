export interface CreateCategoryData {
    name:string
    slug:string
    description?:string
}
export interface  UpdateCategoryData {
    name?:string
    slug?:string
    description?:string
}


export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}
