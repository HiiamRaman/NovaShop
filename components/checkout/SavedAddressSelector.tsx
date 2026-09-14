import Link from "next/link";
import { CheckCircle2, LoaderCircle, MapPin, Plus } from "lucide-react";

export interface CheckoutAddress {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  isDefault: boolean;
}

interface SavedAddressSelectorProps {
  addresses: CheckoutAddress[];
  selectedAddressId: string;
  isLoading: boolean;
  onSelect: (addressId: string) => void;
}

export default function SavedAddressSelector({
  addresses,
  selectedAddressId,
  isLoading,
  onSelect,
}: SavedAddressSelectorProps) {
  const hasReachedAddressLimit = addresses.length >= 3;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 py-12">
        <LoaderCircle className="h-6 w-6 animate-spin text-emerald-600" />

        <span className="ml-3 text-sm text-slate-500">
          Loading saved addresses...
        </span>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900">Shipping address</h2>

          <p className="mt-1 text-sm text-slate-500">
            Select the address for this order.
          </p>
        </div>

        {/* UPDATED: Navigate to a separate page. */}
        {hasReachedAddressLimit ? (
          <span className="rounded-xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Address limit reached
          </span>
        ) : (
          <Link
            href="/checkout/new-address"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            <Plus className="h-4 w-4" />
            New address
          </Link>
        )}
      </div>

      {addresses.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;

            return (
              <button
                key={address.id}
                type="button"
                onClick={() => onSelect(address.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                    : "border-slate-200 bg-white hover:border-emerald-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900">
                        {address.fullName}
                      </p>

                      {address.isDefault && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-600">
                      {address.address}, {address.city}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {address.phone}
                    </p>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center">
          <MapPin className="mx-auto h-9 w-9 text-slate-300" />

          <h3 className="mt-3 font-bold text-slate-800">No saved addresses</h3>

          <p className="mt-1 text-sm text-slate-500">
            Add an address before continuing to payment.
          </p>

          <Link
            href="/checkout/new-address"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add address
          </Link>
        </div>
      )}
    </section>
  );
}
