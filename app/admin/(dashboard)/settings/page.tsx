"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Bell, Save, Settings, Store } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: "NPR" | "USD";
  newOrderNotifications: boolean;
  paymentNotifications: boolean;
  lowStockNotifications: boolean;
}

const initialSettings: StoreSettings = {
  storeName: "",
  supportEmail: "",
  supportPhone: "",
  currency: "NPR",
  newOrderNotifications: true,
  paymentNotifications: true,
  lowStockNotifications: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await api.get("/api/admin/settings");

        const data = response.data as StoreSettings;

        setSettings(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load settings";

        toast.error("Unable to load settings", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);

      const response = await api.patch("/api/admin/settings", settings);

      const updatedSettings = response.data as StoreSettings;

      setSettings(updatedSettings);

      toast.success("Settings saved successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save settings";

      toast.error("Unable to save settings", {
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60";

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 p-7 text-white shadow-xl">
        <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-slate-300">
            <Settings className="h-5 w-5" />

            <span className="text-sm font-medium">Administration</span>
          </div>

          <h2 className="mt-2 text-3xl font-bold">Settings</h2>

          <p className="mt-2 text-sm text-slate-300">
            Configure your store and notification preferences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-2">
        {/* Store information */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
              <Store className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">Store information</h3>

              <p className="text-sm text-slate-400">Basic NovaShop details</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block text-sm font-semibold text-slate-700">
              Store name
              <input
                value={settings.storeName}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    storeName: event.target.value,
                  }))
                }
                disabled={isSaving}
                required
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Support email
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    supportEmail: event.target.value,
                  }))
                }
                disabled={isSaving}
                required
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Support phone
              <input
                type="tel"
                value={settings.supportPhone}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    supportPhone: event.target.value,
                  }))
                }
                disabled={isSaving}
                required
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Currency
              <select
                value={settings.currency}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    currency: event.target.value as "NPR" | "USD",
                  }))
                }
                disabled={isSaving}
                className={inputClass}
              >
                <option value="NPR">NPR</option>
                <option value="USD">USD</option>
              </select>
            </label>
          </div>
        </article>

        {/* Notifications */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <Bell className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">Notifications</h3>

              <p className="text-sm text-slate-400">
                Choose which alerts you receive
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <SettingSwitch
              title="New orders"
              description="Notify me when a new order is created."
              checked={settings.newOrderNotifications}
              disabled={isSaving}
              onChange={(checked) =>
                setSettings((current) => ({
                  ...current,
                  newOrderNotifications: checked,
                }))
              }
            />

            <SettingSwitch
              title="Successful payments"
              description="Notify me when Stripe confirms a payment."
              checked={settings.paymentNotifications}
              disabled={isSaving}
              onChange={(checked) =>
                setSettings((current) => ({
                  ...current,
                  paymentNotifications: checked,
                }))
              }
            />

            <SettingSwitch
              title="Low stock"
              description="Notify me when product stock becomes low."
              checked={settings.lowStockNotifications}
              disabled={isSaving}
              onChange={(checked) =>
                setSettings((current) => ({
                  ...current,
                  lowStockNotifications: checked,
                }))
              }
            />
          </div>
        </article>

        {/* Save button */}
        <div className="flex justify-end xl:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

interface SettingSwitchProps {
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}

function SettingSwitch({
  title,
  description,
  checked,
  disabled,
  onChange,
}: SettingSwitchProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
      <div>
        <p className="font-semibold text-slate-800">{title}</p>

        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-indigo-600"
      />
    </label>
  );
}
