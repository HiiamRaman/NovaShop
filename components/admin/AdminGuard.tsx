"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/apiClient";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({
  children,
}: AdminGuardProps) {
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        // Ask the backend whether the current user is an admin.
        await api.get("/api/admin/me");

        // The API returned 200, so display the dashboard.
        setIsAuthorized(true);
      } catch {
        // The user is logged out or does not have the admin role.
        router.replace("/admin/login");
      }
    }

    checkAdmin();
  }, [router]);

  // Display a loader while checking admin authorization.
  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  // Authorization succeeded, so display the admin layout.
  return <>{children}</>;
}
