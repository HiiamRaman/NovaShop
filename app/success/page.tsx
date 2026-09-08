import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-[#f6f8f7] px-5 py-6">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(13,148,136,0.12),_transparent_38%)]" />

      <div className="absolute left-[8%] top-16 -z-10 h-24 w-24 rounded-full border border-emerald-200/60" />

      <div className="absolute bottom-16 right-[10%] -z-10 h-16 w-16 rotate-12 rounded-3xl bg-teal-100/70" />

      <section className="mx-auto w-full max-w-2xl">
        {/* Payment label */}
        <div className="mb-3 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            Payment completed
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.3)] backdrop-blur-xl">
          {/* Success header */}
          <header className="relative overflow-hidden px-7 pb-6 pt-7 text-center sm:px-10">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-600 to-teal-500" />

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-100" />

              <div className="absolute inset-1.5 rounded-full border border-emerald-200 bg-white shadow-md shadow-emerald-100" />

              <CheckCircle2
                className="relative h-9 w-9 text-emerald-600"
                strokeWidth={2.2}
              />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">
              Order confirmed
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Your order is on its way.
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Thank you for shopping with NovaShop. We received your payment
              and are preparing your items for delivery.
            </p>
          </header>

          {/* Confirmation */}
          <div className="mx-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:mx-8">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
                <PackageCheck className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-slate-900">
                  We received your order
                </h2>

                <p className="mt-0.5 text-sm text-slate-600">
                  Track its progress from your order history.
                </p>
              </div>

              <div className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm sm:flex">
                <Check className="h-3.5 w-3.5" />
                Confirmed
              </div>
            </div>
          </div>

          {/* Order progress */}
          <div className="px-6 py-6 sm:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Order journey
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  What happens next?
                </h2>
              </div>

              <p className="hidden text-xs text-slate-400 sm:block">
                Step 1 of 3 completed
              </p>
            </div>

            <div className="relative mt-5 grid gap-3 sm:grid-cols-3 sm:gap-5">
              <div className="absolute left-[16%] right-[16%] top-5 hidden h-px bg-slate-200 sm:block" />

              <ProgressStep
                icon={<Check className="h-4 w-4" />}
                title="Payment"
                description="Payment received"
                active
              />

              <ProgressStep
                icon={<Clock3 className="h-4 w-4" />}
                title="Processing"
                description="Preparing items"
              />

              <ProgressStep
                icon={<Truck className="h-4 w-4" />}
                title="Delivery"
                description="Coming next"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/orders"
                className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-md shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                <ShoppingBag className="h-4 w-4" />
                View My Orders

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/products"
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 text-center">
              <p className="text-xs text-slate-400">
                Need assistance?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Contact NovaShop Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface ProgressStepProps {
  icon: ReactNode;
  title: string;
  description: string;
  active?: boolean;
}

function ProgressStep({
  icon,
  title,
  description,
  active = false,
}: ProgressStepProps) {
  return (
    <div className="relative flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 sm:flex-col sm:border-0 sm:bg-transparent sm:p-0 sm:text-center">
      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-md ${
          active
            ? "bg-emerald-600 text-white shadow-emerald-200"
            : "bg-slate-100 text-slate-400 shadow-slate-200"
        }`}
      >
        {icon}
      </div>

      <div>
        <p
          className={`text-sm font-bold ${
            active ? "text-emerald-700" : "text-slate-700"
          }`}
        >
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
