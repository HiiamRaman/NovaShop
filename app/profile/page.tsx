import type { Metadata } from "next";

import ProfileContent from "@/components/profile/ProfileContent";

export const metadata: Metadata = {
  title: "My Profile | NovaShop",
  description:
    "Manage your NovaShop account, orders and addresses.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
      <ProfileContent />
    </main>
  );
}
