"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { LoaderCircle, Save, X } from "lucide-react";

import type { ProfileAddress } from "@/types/profile.types";

export interface AddressFormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

interface EditAddressFormProps {
  address: ProfileAddress;
  isSaving: boolean;
  onSave: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}

export default function EditAddressForm({
  address,
  isSaving,
  onSave,
  onCancel,
}: EditAddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: address.fullName,
    phone: address.phone,
    city: address.city,
    address: address.address,
  });

  function updateField(field: keyof AddressFormData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave(formData);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">Edit Address</h3>

          <p className="mt-1 text-sm text-slate-500">
            Update your delivery information
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          aria-label="Close edit form"
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Full name
          <input
            required
            value={formData.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className={inputClass}
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Phone
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={inputClass}
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          City
          <input
            required
            value={formData.city}
            onChange={(event) => updateField("city", event.target.value)}
            className={inputClass}
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Address
          <input
            required
            value={formData.address}
            onChange={(event) => updateField("address", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
