import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminGuard from "@/components/admin/AdminGuard";
interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="flex h-screen w-full overflow-hidden bg-white">
          <AdminSidebar />

          <div className="h-screen min-w-0 flex-1 overflow-y-auto">
            <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/95 px-7 backdrop-blur">
              <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>

              <div className="mx-8 hidden max-w-lg flex-1 items-center rounded-xl bg-slate-100 px-4 lg:flex">
                <Search className="h-4 w-4 text-slate-400" />

                <input
                  placeholder="Search..."
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <button className="relative text-slate-500">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 font-bold text-white">
                    A
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800">
                      Admin
                    </p>
                    <p className="text-xs text-slate-400">Store manager</p>
                  </div>
                </div>
              </div>
            </header>

            <main className="bg-slate-50/70 p-6">{children}</main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
