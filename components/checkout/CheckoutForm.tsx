"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/schemas/checkoutSchema";

export default function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      isDefault: false,
    },
  });

  function onSubmit(data: CheckoutFormData) {
    console.log(data);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Shipping Info</h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter your delivery details
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            {...register("fullName")}
            placeholder="Raman Singh"
            className={inputClass}
          />

          <p className="mt-1 text-xs text-red-500">
            {errors.fullName?.message}
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Phone Number
          </label>

          <input
            {...register("phone")}
            placeholder="9812345678"
            className={inputClass}
          />

          <p className="mt-1 text-xs text-red-500">{errors.phone?.message}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            City
          </label>

          <input
            {...register("city")}
            placeholder="Kathmandu"
            className={inputClass}
          />

          <p className="mt-1 text-xs text-red-500">{errors.city?.message}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Address
          </label>

          <textarea
            {...register("address")}
            placeholder="Baneshwor, near ABC building"
            rows={3}
            className={inputClass}
          />

          <p className="mt-1 text-xs text-red-500">{errors.address?.message}</p>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            {...register("isDefault")}
            className="h-4 w-4 accent-emerald-600"
          />
          Save as my default address
        </label>

        <button
          type="submit"
          className="mt-3 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          Place Order
        </button>
      </div>
    </form>
  );
}
