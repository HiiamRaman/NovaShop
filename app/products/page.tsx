import { getProducts } from "@/services/product.service";
import ProductCard from "@/components/product/productCard";
import CategoryFilter from "@/components/product/categoryFilter";
import { filterProducts } from "@/utils/productFilter";
import { sortProducts } from "@/utils/productSort";
import { paginateProducts } from "@/utils/productPagination";
import SortDropdown from "@/components/product/SortDropdown";
import Pagination from "@/components/product/Pagination";


interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { search, category, sort, page } = await searchParams;

  const products = await getProducts();
 
  const filteredProducts = filterProducts(products, {
    search,
    category,
  });
  const sortedProducts = sortProducts(filteredProducts, { sort });
  const paginatedProducts = paginateProducts(sortedProducts, {
    page,
    limit: "8",
  });

  const currentPage = Number(page) || 1;
  const totalPages = Math.ceil(filteredProducts.length / 8);

  // Empty State
  if (paginatedProducts.length === 0) {
    return (
      <div className="max-w-md mx-auto my-24 px-6 py-10 text-center bg-white/80 backdrop-blur-md rounded-2xl shadow-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mb-5">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No Products Found</h2>
        <p className="mt-2 text-gray-500">
          We couldn't find matches for your selection. Try clearing your filters
          or searches.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gradient-to-b from-white via-slate-50 to-slate-100 rounded-xl shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight relative inline-block">
          {search ? (
            <span>
              Search Results for{" "}
              <span className="text-emerald-600 font-extrabold">
                "{search}"
              </span>
            </span>
          ) : (
            "Explore Our Products"
          )}
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-200 rounded-full"></span>
        </h1>
        <p className="mt-3 text-gray-600 text-sm">
          Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
          premium items
        </p>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-gray-200 shadow-sm mb-10">
        <div className="flex-grow overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <CategoryFilter />
        </div>
        <div className="flex-shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
          <SortDropdown />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg rounded-xl"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-16 pt-8 border-t border-gray-200 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={{ search, category, sort }}
        />
      </div>
    </div>
  );
}

export default ProductsPage;
