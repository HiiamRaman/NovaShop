"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/schemas/loginSchema";
import Link from "next/link";
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    console.log(data);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-400  max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-emerald-100"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>

        <p className="mt-1 text-sm text-slate-500">
          Login to continue shopping
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className={inputClass}
          />

          <p className="mt-1 text-xs text-red-500">{errors.email?.message}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="mt-1 text-xs text-red-500">
            {errors.password?.message}
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          Login
        </button>
      </div>
      <div className="mt-4 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Sign up
        </Link>
      </div>
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;
