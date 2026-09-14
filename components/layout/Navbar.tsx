"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import { api } from "@/lib/apiClient";
import SearchBar from "./Searchbar";
import CartIcon from "./CartIcon";
import LogoutButton from "../Auth/LogoutButton";

interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
}

export default function Navbar() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        // Removed the second argument entirely
        const response = await api.get("/api/auth/me");
        setUser(response.data as CurrentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadCurrentUser();
    // Removed the controller cleanup function
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav
        aria-label="Main Navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-2xl font-black tracking-tight text-slate-900 transition hover:opacity-80"
          aria-label="NovaShop Home"
        >
          <span className="text-emerald-600">Nova</span>Shop
        </Link>

        {/* Desktop Search */}
        <div className="hidden flex-1 lg:block">
          <SearchBar />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="transition hover:text-emerald-600">
            Home
          </Link>

          <Link href="/products" className="transition hover:text-emerald-600">
            Products
          </Link>

          {/* Only logged-in customers can view orders. */}
          {user && (
            <Link href="/orders" className="transition hover:text-emerald-600">
              My Orders
            </Link>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex shrink-0 items-center gap-3">
          <CartIcon />

          {isLoadingUser ? (
            // Skeleton loader to prevent layout shift while checking auth status
            <div
              className="h-9 w-20 animate-pulse rounded-full bg-slate-200 sm:w-28 sm:rounded-xl"
              aria-hidden="true"
            />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 sm:flex"
                aria-label={`Profile for ${user.fullName}`}
              >
                <UserRound className="h-4 w-4" aria-hidden="true" />
                <span className="truncate max-w-[120px]">{user.fullName}</span>
              </Link>

              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="border-t border-slate-100 px-4 py-3 lg:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
