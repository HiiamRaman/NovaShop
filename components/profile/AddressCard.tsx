import {
  LoaderCircle,
  MapPin,
  Pencil,
  Phone,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";

import type { ProfileAddress } from "@/types/profile.types";

interface AddressCardProps {
  address: ProfileAddress;
  isChangingDefault: boolean;
  isDeleting: boolean;
  onEdit: (address: ProfileAddress) => void;
  onMakeDefault: (addressId: string) => void;
  onDelete: (address: ProfileAddress) => void;
}

export default function AddressCard({
  address,
  isChangingDefault,
  isDeleting,
  onEdit,
  onMakeDefault,
  onDelete,
}: AddressCardProps) {
  const isBusy =
    isChangingDefault || isDeleting;

  return (
    <article className="rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <MapPin className="h-5 w-5" />
        </div>

        {address.isDefault && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Default
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <UserRound className="h-4 w-4 text-slate-400" />

        <h3 className="font-bold text-slate-900">
          {address.fullName}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {address.address}
        <br />
        {address.city}
      </p>

      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
        <Phone className="h-4 w-4 text-emerald-600" />
        {address.phone}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(address)}
          disabled={isBusy}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>

        {!address.isDefault && (
          <button
            type="button"
            onClick={() =>
              onMakeDefault(address.id)
            }
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
          >
            {isChangingDefault ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Star className="h-4 w-4" />
            )}

            Make default
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(address)}
          disabled={isBusy}
          className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        >
          {isDeleting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}

          {isDeleting
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    </article>
  );
}
