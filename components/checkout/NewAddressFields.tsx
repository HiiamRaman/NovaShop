"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, MapPin } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/schemas/checkoutSchema";

interface AddressResponse {
  id: string;
}

export default function NewAddressFields() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),

    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      address: "",
      isDefault: false,
    },
  });

  async function onSubmit(
    data: CheckoutFormData
  ) {
    try {
      const response = await api.post(
        "/api/addresses",
        data
      );

      const newAddress =
        response.data as AddressResponse;

      toast.success("Address saved successfully");

      // Return to checkout and automatically select this address.
      router.push(
        `/checkout?addressId=${newAddress.id}`
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save address";

      toast.error("Address could not be saved", {
        description: message,
      });
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  return (
    <section className="mx-auto w-full max-w-2xl">
      <Link
        href="/checkout"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to checkout
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
      >
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-3">
              <MapPin className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Add shipping address
              </h1>

              <p className="mt-1 text-sm text-emerald-100">
                This address will be available during checkout.
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-5 p-6 sm:p-8">
          <FormField
            label="Full name"
            error={errors.fullName?.message}
          >
            <input
              {...register("fullName")}
              placeholder="Raman Singh"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Phone number"
            error={errors.phone?.message}
          >
            <input
              type="tel"
              {...register("phone")}
              placeholder="9812345678"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="City"
            error={errors.city?.message}
          >
            <input
              {...register("city")}
              placeholder="Kathmandu"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Address"
            error={errors.address?.message}
          >
            <textarea
              {...register("address")}
              placeholder="Baneshwor, near ABC building"
              rows={4}
              className={inputClass}
            />
          </FormField>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
            <input
              type="checkbox"
              {...register("isDefault")}
              className="h-4 w-4 accent-emerald-600"
            />

            <span>
              Make this my default address
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            )}

            {isSubmitting
              ? "Saving address..."
              : "Save and return to checkout"}
          </button>
        </div>
      </form>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({
  label,
  error,
  children,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>

      {children}

      {error && (
        <span className="mt-1 block text-xs text-red-500">
          {error}
        </span>
      )}
    </label>
  );
}
