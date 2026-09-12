"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Mail,
  ReceiptText,
  UserRound,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

interface CustomerDetails {
  id: string;
  fullName: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
}

export default function AdminCustomerDetailsPage() {
  const params = useParams<{ customerId: string }>();
  const customerId = params.customerId;

  const [customer, setCustomer] =
    useState<CustomerDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomer() {
      try {
        const response = await api.get(
          `/api/admin/customers/${customerId}`
        );

        setCustomer(response.data as CustomerDetails);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load customer";

        toast.error("Unable to load customer", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  if (!customer) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <UserRound className="h-14 w-14 text-slate-300" />

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Customer not found
        </h1>

        <Link
          href="/admin/customers"
          className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white"
        >
          Return to customers
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-violet-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to customers
      </Link>

      {/* Customer header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white shadow-xl shadow-violet-200">
        <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/20">
            <UserRound className="h-10 w-10" />
          </div>

          <div>
            <p className="text-sm font-medium text-violet-100">
              Customer profile
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              {customer.fullName}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-sm text-violet-100">
              <Mail className="h-4 w-4" />
              {customer.email}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <ReceiptText className="h-6 w-6" />
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Total orders
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {customer.orders}
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Wallet className="h-6 w-6" />
          </div>

          <p className ="mt-5 text-sm font-medium text-slate-500">
                       Total spent
                   </p>

          <p  className="mt-1 text-3xl font-bold text-slate-900">
            NPR{" "}
            {(customer.totalSpent / 100).toLocaleString()}
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Calendar className="h-6 w-6" />
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Joined
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {new Date(customer.joinedAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}
          </p>
        </article>
      </div>
    </section>
  );
}
