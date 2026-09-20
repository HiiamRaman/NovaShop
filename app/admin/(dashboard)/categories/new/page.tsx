import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCategoryPage() {
  return (
    <section className="space-y-6">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Categories
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create Category</h1>

        <p className="mt-2 text-sm text-slate-500">
          The category creation form will appear here.
        </p>
      </div>
    </section>
  );
}
