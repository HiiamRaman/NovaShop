"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Navbar from "./Navbar";
import FloatingLiveChat from "../chat/FloatingLiveChat";
interface AppShellProps {
  children: ReactNode;
}
export default function AppShell({ children }: AppShellProps) {
  const pathName = usePathname();
  const isAdminPage = pathName.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      {children}

      {!isAdminPage && <FloatingLiveChat />}
    </>
  );
}
