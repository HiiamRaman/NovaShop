import Image from "next/image";
import Link from "next/link";
import { Edit3, ImageIcon, Trash2 } from "lucide-react";

import type { AdminProduct } from "@/types/products.types";

interface AdminProductRowProps {
  product: AdminProduct;
  isDeleting: boolean;
  onDelete: (product: AdminProduct) => void;
}

export default function AdminProductRow({
  product,
  isDeleting,
  onDelete,
}: AdminProductRowProps) {
  const firstImage = product.images
    .filter((image) => {
      return typeof image.url === "string" && image.url.trim() !== "";
    })
    .slice()
    .sort((first, second) => {
      return first.position - second.position;
    })[0];

  return (
    <tr className="group transition duration-200 hover:bg-indigo-50/40">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition group-hover:scale-105">
            {firstImage ? (
              <Image
                src={firstImage.url}
                alt={firstImage.alt?.trim() || product.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-slate-400" />
            )}
          </div>

          <div className="min-w-0">
            <p className="line-clamp-1 font-bold text-slate-800">
              {product.name}
            </p>

            <p className="mt-1 text-xs text-slate-400">SKU: {product.sku}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5 font-medium text-slate-600">{product.brand}</td>

      <td className="px-6 py-5 font-bold text-slate-800">
        {product.currency} {(product.priceInMinorUnit / 100).toLocaleString()}
      </td>

      <td className="px-6 py-5">
        <StockBadge stock={product.stock} />
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={product.status} />
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/products/${product.id}/edit`}
            aria-label={`Edit ${product.name}`}
            className="rounded-xl border border-indigo-100 bg-indigo-50 p-2.5 text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
          >
            <Edit3 className="h-4 w-4" />
          </Link>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onDelete(product)}
            aria-label={`Delete ${product.name}`}
            className="rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

interface StockBadgeProps {
  stock: number;
}

function StockBadge({ stock }: StockBadgeProps) {
  const className =
    stock === 0
      ? "bg-red-50 text-red-600"
      : stock <= 10
        ? "bg-amber-50 text-amber-600"
        : "bg-emerald-50 text-emerald-600";

  return (
    <span className={`rounded-lg px-3 py-1.5 text-xs font-bold ${className}`}>
      {stock} in stock
    </span>
  );
}

interface StatusBadgeProps {
  status: AdminProduct["status"];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    active: {
      badge: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-500",
    },

    draft: {
      badge: "bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
    },

    archived: {
      badge: "bg-red-100 text-red-700",
      dot: "bg-red-500",
    },
  };

  const selectedStyle = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${selectedStyle.badge}`}
    >
      <span className={`h-2 w-2 rounded-full ${selectedStyle.dot}`} />

      {status}
    </span>
  );
}
