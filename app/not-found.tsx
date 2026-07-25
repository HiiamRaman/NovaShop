import Link from "next/link";

function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-emerald-100">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
          🔍
        </div>

        <h1 className="mt-6 text-6xl font-black text-slate-900">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          Page Not Found
        </h2>

        <p className="mt-4 leading-relaxed text-slate-500">
          Sorry, the page you are looking for does not exist or may have been removed.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:scale-105"
        >
          Go Back Home
        </Link>

      </div>
    </section>
  );
}

export default NotFound;