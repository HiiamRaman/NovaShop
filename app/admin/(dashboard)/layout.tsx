import type { ReactNode } from "react";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="relative flex min-h-screen bg-slate-50">
        {/* Sticky sidebar */}
        <div className="sticky top-0 h-screen shrink-0 self-start">
          <AdminSidebar />
        </div>

        {/* Right content */}
        <div className="relative flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminHeader />

          <main className="relative min-w-0 flex-1 overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.07),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.07),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.05),_transparent_30%)]" />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-slate-50/60 to-slate-100/70" />

            <div className="relative mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
