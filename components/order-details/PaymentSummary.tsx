import { ReceiptText, Wallet } from "lucide-react";

import { formatMoney } from "@/utils/orderFormatters";

import type { CustomerOrderDetails } from "@/types/order-details.types";

interface PaymentSummaryProps {
  order: CustomerOrderDetails;
}

export default function PaymentSummary({ order }: PaymentSummaryProps) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
          <ReceiptText className="h-5 w-5" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">Payment summary</h2>
      </div>

      <div className="mt-6 space-y-4">
        <SummaryLine
          label="Subtotal"
          value={`${order.currency} ${formatMoney(order.subtotal)}`}
        />

        <SummaryLine
          label="Shipping"
          value={
            order.shipping === 0
              ? "Free"
              : `${order.currency} ${formatMoney(order.shipping)}`
          }
          highlight={order.shipping === 0}
        />

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-emerald-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Total</p>

              <p className="mt-1 text-xs text-slate-400">
                Including all charges
              </p>
            </div>

            <p className="text-xl font-black text-emerald-700">
              {order.currency} {formatMoney(order.total)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
          <Wallet className="h-5 w-5 text-slate-400" />

          <div>
            <p className="text-xs text-slate-400">Payment status</p>

            <p className="mt-1 font-semibold capitalize text-slate-800">
              {order.paymentStatus}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface SummaryLineProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function SummaryLine({ label, value, highlight = false }: SummaryLineProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>

      <span
        className={
          highlight
            ? "font-semibold text-emerald-600"
            : "font-semibold text-slate-900"
        }
      >
        {value}
      </span>
    </div>
  );
}
