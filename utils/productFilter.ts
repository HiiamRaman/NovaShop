// decides which products to show.
import { Product } from "@/types/products.types";

interface FilterOptions {
  search?: string;
  category?: string;
}

export function filterProducts(products: Product[], options: FilterOptions) {
  const { search, category } = options;

  return products.filter((product) => {
    const matchesSearch = search
      ? product.title.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = category
      ? product.category.toLowerCase() === category.toLowerCase()
      : true;

    return matchesSearch && matchesCategory;
  });
}
