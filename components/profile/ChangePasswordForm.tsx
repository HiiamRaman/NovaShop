"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, LoaderCircle, LockKeyhole } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/schemas/changePasswordSchema";
import type { UseFormRegisterReturn } from "react-hook-form";
export default function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormData) {
    try {
      await api.patch("/api/auth/changePassword", data);

      reset();

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      toast.success("Password changed successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to change password";

      toast.error("Password change failed", {
        description: message,
      });
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
            <LockKeyhole className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Change Password
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update the password used to access your NovaShop account.
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6 sm:p-8">
        <PasswordField
          id="currentPassword"
          label="Current password"
          placeholder="Enter your current password"
          showPassword={showCurrentPassword}
          onToggle={() => setShowCurrentPassword((current) => !current)}
          error={errors.currentPassword?.message}
          inputProps={register("currentPassword")}
        />

        <PasswordField
          id="newPassword"
          label="New password"
          placeholder="Enter a new password"
          showPassword={showNewPassword}
          onToggle={() => setShowNewPassword((current) => !current)}
          error={errors.newPassword?.message}
          inputProps={register("newPassword")}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          placeholder="Enter the new password again"
          showPassword={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((current) => !current)}
          error={errors.confirmPassword?.message}
          inputProps={register("confirmPassword")}
        />

        <div className="rounded-2xl bg-amber-50 p-4">
          <div className="flex gap-3">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Password requirement
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Your new password must contain at least 8 characters and must be
                different from your current password.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-7"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <LockKeyhole className="h-5 w-5" />
          )}

          {isSubmitting ? "Changing password..." : "Change password"}
        </button>
      </form>
    </section>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  showPassword: boolean;
  onToggle: () => void;
  error?: string;

  inputProps: UseFormRegisterReturn;
}

function PasswordField({
  id,
  label,
  placeholder,
  showPassword,
  onToggle,
  error,
  inputProps,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...inputProps}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
