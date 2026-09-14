import {
  KeyRound,
  MapPin,
  Package,
  UserRound,
  ShoppingBag,
} from "lucide-react";

import LogoutButton from "../Auth/LogoutButton";

import type { CurrentUser, ProfileTab } from "@/types/profile.types";

interface ProfileSidebarProps {
  user: CurrentUser;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export default function ProfileSidebar({
  user,
  activeTab,
  onTabChange,
}: ProfileSidebarProps) {
  const initials = user.fullName
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-7 text-center text-white">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-2xl font-black">
          {initials || "NS"}
        </div>

        <h1 className="mt-4 text-xl font-bold">{user.fullName}</h1>

        <p className="mt-1 truncate text-sm text-emerald-100">{user.email}</p>
      </div>

      <nav className="space-y-2 p-4">
        <SidebarButton
          active={activeTab === "personal"}
          label="Personal Information"
          icon={<UserRound className="h-5 w-5" />}
          onClick={() => onTabChange("personal")}
        />

        <SidebarButton
          active={activeTab === "orders"}
          label="My Orders"
          icon={<ShoppingBag className="h-5 w-5" />}
          onClick={() => onTabChange("orders")}
        />

        <SidebarButton
          active={activeTab === "addresses"}
          label="Addresses"
          icon={<MapPin className="h-5 w-5" />}
          onClick={() => onTabChange("addresses")}
        />
        <SidebarButton
          active={activeTab === "security"}
          label="Password & Security"
          icon={<KeyRound className="h-5 w-5" />}
          onClick={() => onTabChange("security")}
        />

        <div className="border-t border-slate-100 pt-4">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}

interface SidebarButtonProps {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function SidebarButton({ active, label, icon, onClick }: SidebarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
