"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import { signupSchema, type SignupFormData } from "@/schemas/signupSchema";

export default function SignupForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupFormData) {
    try {
      await api.post("/api/auth/signup", data);

      toast.success("Account created", {
        description: "You can now log in to NovaShop.",
      });

      // Signup creates the account.
      // Login will create the authenticated session.
      router.replace("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create account";

      toast.error("Signup failed", {
        description: message,
      });
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-emerald-200/50"
    >
      <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>

      <p className="mt-1 text-sm text-slate-500">Join NovaShop today</p>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Name
          </label>

          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            placeholder="Lewis Hamilton"
            autoComplete="name"
            className={inputClass}
          />

          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

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
            placeholder="example@gmail.com"
            autoComplete="email"
            className={inputClass}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

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
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              autoComplete="new-password"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Confirm Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              autoComplete="new-password"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
