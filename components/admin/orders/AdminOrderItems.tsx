import Image from "next/image";
import { Package } from "lucide-react";

import type { AdminOrderItem } from "@/types/admin-order.types";

interface AdminOrderItemsProps {
  items: AdminOrderItem[];
  currency: "NPR" | "USD";
}

export default function AdminOrderItems({
  items,
  currency,
}: AdminOrderItemsProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-900">Ordered items</h2>

        <p className="mt-1 text-sm text-slate-500">
          {items.length} {items.length === 1 ? "product type" : "product types"}{" "}
          in this order
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <article
            key={item.productId}
            className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
          >
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <Package className="h-8 w-8 text-slate-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900">{item.name}</h3>

              <p className="mt-1 text-sm text-slate-500">
                Quantity: {item.quantity}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Unit price: {currency} {(item.unitPrice / 100).toLocaleString()}
              </p>
            </div>

            <p className="font-bold text-slate-900">
              {currency} {(item.lineTotal / 100).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
