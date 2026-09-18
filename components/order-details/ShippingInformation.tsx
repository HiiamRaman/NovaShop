import { MapPin, Phone, UserRound } from "lucide-react";

import type { ReactNode } from "react";
import type { OrderShippingAddress } from "@/types/order-details.types";

interface ShippingInformationProps {
  address: OrderShippingAddress;
}

export default function ShippingInformation({
  address,
}: ShippingInformationProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
          <MapPin className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Shipping information
          </h2>

          <p className="text-sm text-slate-500">
            Delivery details for this order
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <InformationItem
          icon={<UserRound className="h-5 w-5" />}
          label="Recipient"
          value={address.fullName}
        />

        <InformationItem
          icon={<Phone className="h-5 w-5" />}
          label="Phone"
          value={address.phone}
        />

        <InformationItem
          icon={<MapPin className="h-5 w-5" />}
          label="Delivery address"
          value={`${address.address}, ${address.city}`}
          fullWidth
        />
      </div>
    </section>
  );
}

interface InformationItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}

function InformationItem({
  icon,
  label,
  value,
  fullWidth = false,
}: InformationItemProps) {
  return (
    <div
      className={`rounded-2xl bg-slate-50 p-4 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-emerald-600">{icon}</div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
