import { Search } from "lucide-react";

interface AdminProductsToolbarProps {
  search: string;
  productCount: number;
  onSearchChange: (value: string) => void;
}

export default function AdminProductsToolbar({
  search,
  productCount,
  onSearchChange,
}: AdminProductsToolbarProps) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search by product, brand or SKU..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      <div className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
        {productCount}{" "}
        {productCount === 1
          ? "product"
          : "products"}
      </div>
    </div>
  );
}
