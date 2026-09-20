import type { PublicCategory } from "@/types/category.types";
import type {
  Product,
  ProductPagination,
} from "@/types/products.types";

import ProductsHeader from "./ProductsHeader";
import ProductsSidebar from "./ProductsSidebar";
import ProductsResults from "./ProductsResults";

interface ProductCatalogProps {
  products: Product[];
  categories: PublicCategory[];
  pagination: ProductPagination;
  search?: string;
  category?: string;
  sort?: string;
}

export default function ProductCatalog({
  products,
  categories,
  pagination,
  search,
  category,
  sort,
}: ProductCatalogProps) {
  const selectedCategory =
    categories.find(
      (currentCategory) =>
        currentCategory.id === category
    );

  return (
    <main className="min-h-screen bg-slate-50 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.07),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.06),_transparent_28%)]">
      <div className="grid min-h-screen items-start lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProductsSidebar
          categories={categories}
          search={search}
          category={category}
          sort={sort}
        />

        <div className="min-w-0 px-4 py-8 sm:px-6 lg:px-8 lg:py-10 xl:px-10">
          <ProductsHeader
            search={search}
            selectedCategory={
              selectedCategory
            }
            visibleProducts={
              products.length
            }
            totalProducts={
              pagination.totalProducts
            }
          />

          <ProductsResults
            products={products}
            pagination={pagination}
            selectedCategory={
              selectedCategory
            }
            search={search}
            category={category}
            sort={sort}
          />
        </div>
      </div>
    </main>
  );
}
