import {
  CalendarDays,
  Mail,
  ReceiptText,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";

import type { CurrentUser, ProfileOrder } from "@/types/profile.types";

interface PersonalInformationProps {
  user: CurrentUser;
  orders: ProfileOrder[];
}

export default function PersonalInformation({
  user,
  orders,
}: PersonalInformationProps) {
  // Only paid orders count toward total spending.
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");

  const totalSpentInMinorUnit = paidOrders.reduce((total, order) => {
    return total + order.total;
  }, 0);

  const currency = paidOrders[0]?.currency ?? "NPR";

  const joinedAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your NovaShop account details
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <InformationField
            label="Full name"
            value={user.fullName}
            icon={<UserRound className="h-5 w-5" />}
          />

          <InformationField
            label="Email address"
            value={user.email}
            icon={<Mail className="h-5 w-5" />}
          />

          <InformationField
            label="Account role"
            value={user.role}
            icon={<ShieldCheck className="h-5 w-5" />}
          />

          <InformationField
            label="Member since"
            value={joinedAt}
            icon={<CalendarDays className="h-5 w-5" />}
          />
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <StatCard
          label="Total orders"
          value={orders.length.toString()}
          icon={<ReceiptText className="h-6 w-6" />}
          color="bg-blue-100 text-blue-700"
        />

        <StatCard
          label="Total spent"
          value={`${currency} ${(
            totalSpentInMinorUnit / 100
          ).toLocaleString()}`}
          icon={<Wallet className="h-6 w-6" />}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>
    </div>
  );
}

interface InformationFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function InformationField({ label, value, icon }: InformationFieldProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-3 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </article>
  );
}
