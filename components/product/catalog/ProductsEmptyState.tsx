import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function ProductsEmptyState() {
  return (
    <div className="px-6 py-16 text-center sm:py-20">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600">
        <PackageSearch className="h-9 w-9" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        No Products Found
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        We could not find products matching your current search and filters.
      </p>

      <Link
        href="/products"
        className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700"
      >
        Clear All Filters
      </Link>
    </div>
  );
}
