import Image from "next/image";
import { ImageIcon, Package } from "lucide-react";

import { formatMoney } from "@/utils/orderFormatters";

import type { OrderDetailItem } from "@/types/order-details.types";

interface OrderItemsProps {
  items: OrderDetailItem[];
  currency: string;
}

export default function OrderItems({ items, currency }: OrderItemsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
          <Package className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">Order items</h2>

          <p className="text-sm text-slate-500">
            {items.length} {items.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <div className="mt-6 divide-y divide-slate-100">
        {items.map((item) => (
          <OrderItemCard key={item.productId} item={item} currency={currency} />
        ))}
      </div>
    </section>
  );
}

interface OrderItemCardProps {
  item: OrderDetailItem;
  currency: string;
}

function OrderItemCard({ item, currency }: OrderItemCardProps) {
  const imageUrl = item.image?.trim();

  return (
    <article className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name || "Order product"}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-7 w-7 text-slate-300" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-bold text-slate-900">{item.name}</h3>

          <p className="mt-2 text-sm text-slate-500">
            {currency} {formatMoney(item.unitPrice)} × {item.quantity}
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-xs text-slate-400">Line total</p>

          <p className="mt-1 font-bold text-slate-900">
            {currency} {formatMoney(item.lineTotal)}
          </p>
        </div>
      </div>
    </article>
  );
}
