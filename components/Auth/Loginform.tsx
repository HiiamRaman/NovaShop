"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import { loginSchema, type LoginFormData } from "@/schemas/loginSchema";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      // The backend validates the credentials and sets authentication cookies.
      await api.post("/api/auth/login", data);

      toast.success("Login successful", {
        description: "Welcome back to NovaShop.",
      });

      // Send the customer back to the products page.
    window.location.replace("/");

     router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to log in";

      toast.error("Login failed", {
        description: message,
      });
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-emerald-100"
      noValidate
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
        <p className="mt-1 text-sm text-slate-500">
          Login to continue shopping
        </p>
      </div>

      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            disabled={isSubmitting}
            placeholder="Enter your email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${inputClass} ${
              errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
            }`}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              disabled={isSubmitting}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`${inputClass} pr-12 ${
                errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
              }`}
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" role="alert" className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </div>

      {/* Footer Links */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Sign up
          </Link>
        </div>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
