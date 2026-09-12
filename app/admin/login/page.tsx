"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { loginSchema } from "@/schemas/loginSchema";
import { api } from "@/lib/apiClient";
type AdminLoginData = z.infer<typeof loginSchema>;


export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 async function onSubmit(data: AdminLoginData) {
  try {
    // Authenticate the email and password.
    await api.post("/api/auth/login", data);

    // Confirm that the logged-in account is an admin.
    await api.get("/api/admin/me");

    toast.success("Welcome back", {
      description: "Admin login successful.",
    });

    router.replace("/admin");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to sign in";

    toast.error("Login failed", {
      description: message,
    });
  }
}

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080833] px-5 py-10">
      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />

      <section className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl lg:grid-cols-2">
        {/* Left panel */}
        <div className="hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-indigo-700">
              N
            </div>

            <h1 className="mt-8 text-4xl font-bold leading-tight">
              Manage NovaShop from one place.
            </h1>

            <p className="mt-4 leading-7 text-indigo-100">
              Control products, orders, customers and revenue through your
              administration panel.
            </p>
          </div>

          <p className="text-sm text-indigo-200">
            Secure access for authorized administrators only.
          </p>
        </div>

        {/* Login form */}
        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <LockKeyhole className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-slate-900">
              Admin Login
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your administrator credentials.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    {...register("email")}
                    placeholder="admin@novashop.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <p className="mt-1 text-xs text-red-500">
                  {errors.email?.message}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="mt-1 text-xs text-red-500">
                  {errors.password?.message}
                </p>
              </div>

            

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in to Dashboard"}
              </button>
            </form>

            <Link
              href="/"
              className="mt-6 block text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Return to NovaShop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
