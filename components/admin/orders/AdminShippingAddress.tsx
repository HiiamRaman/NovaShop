import { MapPin, Phone, User } from "lucide-react";

import type { AdminShippingAddress as ShippingAddress } from "@/types/admin-order.types";

interface AdminShippingAddressProps {
  address: ShippingAddress;
}

export default function AdminShippingAddress({
  address,
}: AdminShippingAddressProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
          <MapPin className="h-5 w-5" />
        </div>

        <h2 className="text-lg font-bold text-slate-900">Shipping address</h2>
      </div>

      <div className="mt-6 space-y-4 text-sm">
        <AddressRow
          icon={<User className="h-4 w-4" />}
          value={address.fullName}
          emphasized
        />

        <AddressRow
          icon={<Phone className="h-4 w-4" />}
          value={address.phone}
        />

        <AddressRow
          icon={<MapPin className="h-4 w-4" />}
          value={`${address.address}, ${address.city}`}
        />
      </div>
    </section>
  );
}

interface AddressRowProps {
  icon: React.ReactNode;
  value: string;
  emphasized?: boolean;
}

function AddressRow({ icon, value, emphasized = false }: AddressRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>

      <span
        className={
          emphasized ? "font-semibold text-slate-800" : "text-slate-600"
        }
      >
        {value}
      </span>
    </div>
  );
}
