"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

import AdminProductsHeader from "@/components/admin/products/AdminProductsHeader";
import AdminProductsToolbar from "@/components/admin/products/AdminProductsToolbar";
import AdminProductsTable from "@/components/admin/products/AdminProductsTable";
import AdminProductsPagination from "@/components/admin/products/AdminProductsPagination";

import type {
  AdminProduct,
  AdminProductsResponseData,
  ProductPagination,
} from "@/types/products.types";

const PRODUCTS_PER_PAGE = 10;

const initialPagination: ProductPagination = {
  currentPage: 1,
  limit: PRODUCTS_PER_PAGE,
  totalProducts: 0,
  totalPages: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [pagination, setPagination] =
    useState<ProductPagination>(initialPagination);

  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  /*
  Load one page of products from the admin API.

  Search remains local for now because the store
  currently contains only a small number of products.
  */
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);

        const response = await api.get(
          `/api/admin/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`
        );

        const data = response.data as AdminProductsResponseData;

        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch products";

        toast.error("Unable to load products", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [currentPage]);

  /*
  Filter the products already loaded on the current page.

  Later, when the product collection becomes larger,
  this can be replaced with backend search.
  */
  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchValue) ||
        product.brand.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue)
      );
    });
  }, [products, search]);

  async function handleDeleteProduct(product: AdminProduct) {
    if (deletingProductId) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${product.name}"? This product will no longer appear in the customer store.`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingProductId(product.id);

      await api.delete(`/api/admin/products/${product.id}`);

      const remainingProducts = products.filter(
        (currentProduct) => currentProduct.id !== product.id
      );

      /*
      If the final product on a later page was deleted,
      return to the previous page.
      */
      if (remainingProducts.length === 0 && currentPage > 1) {
        setCurrentPage((previousPage) => previousPage - 1);
      } else {
        setProducts(remainingProducts);

        setPagination((currentPagination) => {
          const totalProducts = Math.max(
            currentPagination.totalProducts - 1,
            0
          );

          const totalPages = Math.ceil(totalProducts / currentPagination.limit);

          return {
            ...currentPagination,
            totalProducts,
            totalPages,
          };
        });
      }

      toast.success("Product deleted", {
        description: `${product.name} was removed successfully.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete product";

      toast.error("Delete failed", {
        description: message,
      });
    } finally {
      setDeletingProductId(null);
    }
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > pagination.totalPages || page === currentPage) {
      return;
    }

    setSearch("");
    setCurrentPage(page);
  }

  return (
    <section className="space-y-6">
      <AdminProductsHeader />

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <AdminProductsToolbar
          search={search}
          productCount={filteredProducts.length}
          onSearchChange={setSearch}
        />

        <AdminProductsTable
          products={filteredProducts}
          isLoading={isLoading}
          deletingProductId={deletingProductId}
          onDelete={handleDeleteProduct}
        />

        {!isLoading && (
          <AdminProductsPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}
