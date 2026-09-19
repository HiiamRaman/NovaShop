import Link from "next/link";
import { Package, Plus } from "lucide-react";

export default function AdminProductsHeader() {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-7 text-white shadow-xl shadow-indigo-200">
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />

      <div className="absolute -bottom-20 right-40 h-44 w-44 rounded-full bg-white/10" />

      <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-indigo-100">
            <Package className="h-5 w-5" />

            <span className="text-sm font-medium">Product Management</span>
          </div>

          <h1 className="mt-2 text-3xl font-bold">Products</h1>

          <p className="mt-2 max-w-lg text-sm text-indigo-100">
            Manage product information, pricing and stock.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>
    </header>
  );
}
