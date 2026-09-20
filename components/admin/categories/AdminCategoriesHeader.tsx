import { FolderTree } from "lucide-react";

export default function AdminCategoriesHeader() {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 p-7 text-white shadow-xl shadow-emerald-200">
      <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10" />

      <div className="absolute -bottom-20 right-40 h-44 w-44 rounded-full bg-white/10" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-emerald-50">
          <FolderTree className="h-5 w-5" />

          <span className="text-sm font-medium">Category Management</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold">Categories</h1>

        <p className="mt-2 text-sm text-emerald-50">
          Create categories and control which ones are visible to customers.
        </p>
      </div>
    </header>
  );
}
