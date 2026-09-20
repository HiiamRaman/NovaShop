"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Boxes,
  ChevronRight,
  CircleUserRound,
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  ReceiptText,
  Settings,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from "lucide-react";

type PageIcon =
  | "dashboard"
  | "products"
  | "create-product"
  | "edit-product"
  | "images"
  | "categories"
  | "orders"
  | "order-details"
  | "customers"
  | "customer-details"
  | "revenue"
  | "settings";

interface PageInformation {
  title: string;
  description: string;
  icon: PageIcon;
  iconStyle: string;
}

function getPageInformation(
  pathname: string
): PageInformation {
  if (pathname === "/admin") {
    return {
      title: "Dashboard",
      description: "A quick overview of your NovaShop store",
      icon: "dashboard",
      iconStyle:
        "bg-emerald-100 text-emerald-700 ring-emerald-200",
    };
  }

  if (pathname.startsWith("/admin/products/new")) {
    return {
      title: "Create Product",
      description: "Add a new product to your catalogue",
      icon: "create-product",
      iconStyle:
        "bg-sky-100 text-sky-700 ring-sky-200",
    };
  }

  if (
    pathname.includes("/admin/products/") &&
    pathname.endsWith("/edit")
  ) {
    return {
      title: "Edit Product",
      description: "Update product information and inventory",
      icon: "edit-product",
      iconStyle:
        "bg-indigo-100 text-indigo-700 ring-indigo-200",
    };
  }

  if (
    pathname.includes("/admin/products/") &&
    pathname.endsWith("/images")
  ) {
    return {
      title: "Product Images",
      description: "Manage images and their display order",
      icon: "images",
      iconStyle:
        "bg-violet-100 text-violet-700 ring-violet-200",
    };
  }

  if (pathname.startsWith("/admin/products")) {
    return {
      title: "Products",
      description: "Manage products, prices and inventory",
      icon: "products",
      iconStyle:
        "bg-blue-100 text-blue-700 ring-blue-200",
    };
  }

  if (pathname.startsWith("/admin/categories")) {
    return {
      title: "Categories",
      description: "Organize your product catalogue",
      icon: "categories",
      iconStyle:
        "bg-teal-100 text-teal-700 ring-teal-200",
    };
  }

  if (pathname.startsWith("/admin/orders/")) {
    return {
      title: "Order Details",
      description: "Review and manage this customer order",
      icon: "order-details",
      iconStyle:
        "bg-amber-100 text-amber-700 ring-amber-200",
    };
  }

  if (pathname.startsWith("/admin/orders")) {
    return {
      title: "Orders",
      description: "Manage customer orders and deliveries",
      icon: "orders",
      iconStyle:
        "bg-orange-100 text-orange-700 ring-orange-200",
    };
  }

  if (pathname.startsWith("/admin/customers/")) {
    return {
      title: "Customer Details",
      description: "Review this customer’s account activity",
      icon: "customer-details",
      iconStyle:
        "bg-cyan-100 text-cyan-700 ring-cyan-200",
    };
  }

  if (pathname.startsWith("/admin/customers")) {
    return {
      title: "Customers",
      description: "View and manage customer accounts",
      icon: "customers",
      iconStyle:
        "bg-cyan-100 text-cyan-700 ring-cyan-200",
    };
  }

  if (pathname.startsWith("/admin/revenue")) {
    return {
      title: "Revenue",
      description: "Review sales and payment performance",
      icon: "revenue",
      iconStyle:
        "bg-emerald-100 text-emerald-700 ring-emerald-200",
    };
  }

  if (pathname.startsWith("/admin/settings")) {
    return {
      title: "Settings",
      description: "Configure your store preferences",
      icon: "settings",
      iconStyle:
        "bg-slate-100 text-slate-700 ring-slate-200",
    };
  }

  return {
    title: "Admin Panel",
    description: "Manage your NovaShop store",
    icon: "dashboard",
    iconStyle:
      "bg-emerald-100 text-emerald-700 ring-emerald-200",
  };
}

function PageIcon({
  icon,
}: {
  icon: PageIcon;
}) {
  const iconClass = "h-5 w-5";

  switch (icon) {
    case "products":
      return <Boxes className={iconClass} />;

    case "create-product":
      return <PackagePlus className={iconClass} />;

    case "edit-product":
      return <PackageSearch className={iconClass} />;

    case "images":
      return <ImageIcon className={iconClass} />;

    case "categories":
      return <FolderTree className={iconClass} />;

    case "orders":
      return <ShoppingBag className={iconClass} />;

    case "order-details":
      return <ReceiptText className={iconClass} />;

    case "customers":
    case "customer-details":
      return <UsersRound className={iconClass} />;

    case "revenue":
      return <BarChart3 className={iconClass} />;

    case "settings":
      return <Settings className={iconClass} />;

    default:
      return <LayoutDashboard className={iconClass} />;
  }
}

export default function AdminHeader() {
  const pathname = usePathname();

  const pageInformation =
    getPageInformation(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 shadow-sm shadow-slate-200/40 backdrop-blur-xl">
      <div className="relative flex min-h-24 items-center justify-between gap-5 overflow-hidden px-5 sm:px-7 lg:px-8">
        {/* Soft background colours */}
        <div className="pointer-events-none absolute -left-12 -top-20 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl" />

        <div className="pointer-events-none absolute right-24 top-0 h-28 w-28 rounded-full bg-sky-100/70 blur-3xl" />

        <div className="relative flex min-w-0 items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 shadow-sm ${pageInformation.iconStyle}`}
          >
            <PageIcon icon={pageInformation.icon} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Link
                href="/admin"
                className="transition hover:text-emerald-600"
              >
                Admin
              </Link>

              <ChevronRight className="h-3.5 w-3.5" />

              <span className="truncate text-emerald-600">
                {pageInformation.title}
              </span>
            </div>

            <h1 className="mt-1 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {pageInformation.title}
            </h1>

            <p className="mt-0.5 hidden text-xs text-slate-500 md:block">
              {pageInformation.description}
            </p>
          </div>
        </div>

        <div className="relative flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 lg:flex">
            <Sparkles className="h-3.5 w-3.5" />
            NovaShop Admin
          </div>

          <button
            type="button"
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <Link
            href="/admin/settings"
            className="group flex items-center gap-3 rounded-2xl border border-transparent px-2 py-1.5 transition hover:border-emerald-100 hover:bg-emerald-50/70"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 font-bold text-white shadow-md shadow-emerald-200/70">
              A
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800 transition group-hover:text-emerald-700">
                Admin
              </p>

              <p className="text-xs text-slate-400">
                Store manager
              </p>
            </div>

            <CircleUserRound className="hidden h-5 w-5 text-slate-400 transition group-hover:text-emerald-600 lg:block" />
          </Link>
        </div>
      </div>
    </header>
  );
}
