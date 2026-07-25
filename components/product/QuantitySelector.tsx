"use client";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (value: number) => void;
}

export default function QuantitySelector({
  quantity,
  setQuantity,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4 mt-6">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl font-semibold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
      >
        −
      </button>

      <span className="flex h-11 min-w-[60px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-bold text-slate-900">
        {quantity}
      </span>

      <button
        onClick={() => setQuantity(quantity + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl font-semibold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
      >
        +
      </button>
    </div>
  );
}
