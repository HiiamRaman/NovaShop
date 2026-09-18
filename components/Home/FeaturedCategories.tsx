import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";

import { connectDB } from "@/lib/mongodb";
import { getActiveCategories } from "@/services/category.service";

export default async function FeaturedCategories() {
  // Server Components must connect before using repository/service functions.
  await connectDB();

  // Fetch only categories that are active and visible to customers.
  const categories = await getActiveCategories();

  // The homepage displays only the first four featured categories.
  const featuredCategories = categories.slice(0, 4);

  if (featuredCategories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Collections
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Shop by Category
          </h2>

          <p className="mt-4 text-lg text-slate-500">
            Explore our popular collections and discover products selected for
            every lifestyle.
          </p>
        </div>

        {/* Active categories from MongoDB */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              href={{
                pathname: "/products",
                query: {
                  category: category.id,
                },
              }}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <Layers3 className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold capitalize text-slate-900">
                {category.name}
              </h3>

              {category.description && (
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                  {category.description}
                </p>
              )}

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                Explore collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
