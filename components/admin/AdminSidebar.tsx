"use client";

import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/apiClient";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ReceiptText,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ReceiptText },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Revenue", href: "/admin/revenue", icon: WalletCards },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await api.post("/api/auth/logout");

      toast.success("Logged out successfully");
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to log out";

      toast.error("Logout failed", {
        description: message,
      });
    } finally {
      setIsLoggingOut(false);
    }
  }
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col overflow-y-auto bg-[#080833] px-5 py-7 text-white">
      <Link href="/admin" className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#080833]">
          N
        </div>

        <div>
          <p className="font-bold">NovaShop</p>
          <p className="text-xs text-indigo-300">Commerce Admin</p>
        </div>
      </Link>

      <nav className="mt-12 flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950"
                  : "text-indigo-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
  type="button"
  onClick={handleLogout}
  disabled={isLoggingOut}
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition  hover:bg-red-500/10 hover:text-red-300  disabled:cursor-not-allowed disabled:opacity-60"
>
  <LogOut className="h-5 w-5" />

  <span>
    {isLoggingOut ? "Logging out..." : "Logout"}
  </span>
</button>
    </aside>
  );
}
