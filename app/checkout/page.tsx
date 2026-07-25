import CheckoutContent from "@/components/checkout/CheckoutContent";
function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Checkout</h1>

      <CheckoutContent />
    </div>
  );
}

export default CheckoutPage;
