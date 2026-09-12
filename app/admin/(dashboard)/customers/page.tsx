"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, Search, UserRound, Users } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/apiClient";
interface Customer {
  id: string;
  fullName: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await api.get("/api/admin/customers");
        const data = response.data as Customer[];

        setCustomers(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load customers";

        toast.error("Unable to load customers", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();

    return customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(value) ||
        customer.email.toLowerCase().includes(value)
    );
  }, [customers, search]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-7 text-white shadow-xl shadow-violet-200">
        <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-violet-100">
            <Users className="h-5 w-5" />

            <span className="text-sm font-medium">Customer Management</span>
          </div>

          <h2 className="mt-2 text-3xl font-bold">Customers</h2>

          <p className="mt-2 text-sm text-violet-100">
            View customers and their purchasing activity.
          </p>
        </div>
      </div>

      {/* Customer list */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Search */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer or email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <span className="rounded-xl bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
            {filteredCustomers.length} customers
          </span>
        </div>

        {/* Loading or table */}
        {isLoading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Total spent</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-violet-50/40"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-bold text-slate-800">
                            {customer.fullName}
                          </p>

                          <p className="text-xs text-slate-400">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-700">
                      {customer.orders}
                    </td>

                    <td className="px-6 py-5 font-bold text-slate-800">
                      NPR {(customer.totalSpent / 100).toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {new Date(customer.joinedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        aria-label={`View ${customer.fullName}`}
                        className="inline-flex rounded-xl bg-violet-50 p-2.5 text-violet-600 transition hover:bg-violet-600 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredCustomers.length === 0 && (
          <div className="py-16 text-center">
            <UserRound className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">
              No customers found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try searching with a different name or email.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
