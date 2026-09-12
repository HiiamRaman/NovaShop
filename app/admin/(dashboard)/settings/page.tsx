"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Bell, Save, Settings, Store } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";

  return (
    <section className="space-y-6">
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
              <input defaultValue="NovaShop" className={inputClass} />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Support email
              <input
                type="email"
                defaultValue="support@novashop.com"
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Support phone
              <input defaultValue="9812345678" className={inputClass} />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Currency
              <select className={inputClass} defaultValue="NPR">
                <option value="NPR">NPR</option>
                <option value="USD">USD</option>
              </select>
            </label>
          </div>
        </article>

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
            />

            <SettingSwitch
              title="Successful payments"
              description="Notify me when Stripe confirms a payment."
            />

            <SettingSwitch
              title="Low stock"
              description="Notify me when product stock becomes low."
            />
          </div>
        </article>

        <div className="flex items-center justify-end gap-4 xl:col-span-2">
          {saved && (
            <p className="text-sm font-semibold text-emerald-600">
              Settings saved successfully
            </p>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}

interface SettingSwitchProps {
  title: string;
  description: string;
}

function SettingSwitch({ title, description }: SettingSwitchProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50">
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      <input
        type="checkbox"
        defaultChecked
        className="h-5 w-5 accent-indigo-600"
      />
    </label>
  );
}
