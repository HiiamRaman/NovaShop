import CheckoutContent from "@/components/checkout/CheckoutContent";

function CheckoutPage() {
  return (
    <div className="min-h-screen bg-emerald-50/20 py-12 transition-colors duration-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
            Checkout
          </h1>
          <p className="text-sm text-zinc-500">
            Complete your details below to finalize your order.
          </p>
        </div>

        {/* Checkout Main Card Container */}
        <div className="rounded-2xl border border-emerald-100 bg-white/95 p-6 sm:p-8 shadow-xl shadow-emerald-200/40 backdrop-blur-sm">
          <CheckoutContent />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
