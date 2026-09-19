import { PackageSearch } from "lucide-react";

import AdminProductRow from "./AdminProductRow";

import type { AdminProduct } from "@/types/products.types";

interface AdminProductsTableProps {
  products: AdminProduct[];
  isLoading: boolean;
  deletingProductId: string | null;
  onDelete: (product: AdminProduct) => void;
}

export default function AdminProductsTable({
  products,
  isLoading,
  deletingProductId,
  onDelete,
}: AdminProductsTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div
          role="status"
          aria-label="Loading products"
          className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <PackageSearch className="h-7 w-7 text-slate-400" />
        </div>

        <h3 className="mt-4 font-bold text-slate-800">No products found</h3>

        <p className="mt-1 text-sm text-slate-500">
          Try searching with a different name, brand or SKU.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4 font-semibold">Product</th>

            <th className="px-6 py-4 font-semibold">Brand</th>

            <th className="px-6 py-4 font-semibold">Price</th>

            <th className="px-6 py-4 font-semibold">Stock</th>

            <th className="px-6 py-4 font-semibold">Status</th>

            <th className="px-6 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <AdminProductRow
              key={product.id}
              product={product}
              isDeleting={deletingProductId === product.id}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
