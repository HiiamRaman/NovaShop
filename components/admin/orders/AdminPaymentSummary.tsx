import { CreditCard } from "lucide-react";

interface AdminPaymentSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  currency: "NPR" | "USD";
}

export default function AdminPaymentSummary({
  subtotal,
  shipping,
  total,
  currency,
}: AdminPaymentSummaryProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
          <CreditCard className="h-5 w-5" />
        </div>

        <h2 className="text-lg font-bold text-slate-900">Payment summary</h2>
      </div>

      <div className="mt-6 space-y-4 text-sm">
        <PriceRow label="Subtotal" value={formatMoney(subtotal, currency)} />

        <PriceRow
          label="Shipping"
          value={shipping === 0 ? "Free" : formatMoney(shipping, currency)}
          valueClassName="text-emerald-600"
        />

        <div className="border-t border-slate-200 pt-4">
          <div className="flex justify-between gap-4">
            <span className="text-base font-bold text-slate-900">Total</span>

            <span className="text-lg font-bold text-indigo-600">
              {formatMoney(total, currency)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatMoney(amountInMinorUnit: number, currency: "NPR" | "USD") {
  return `${currency} ${(amountInMinorUnit / 100).toLocaleString()}`;
}

interface PriceRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function PriceRow({
  label,
  value,
  valueClassName = "text-slate-800",
}: PriceRowProps) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>

      <span className={`font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}
