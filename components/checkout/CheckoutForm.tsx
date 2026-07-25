"use client";

import { useState } from "react";

function CheckoutForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg "
    >
      <h2 className="text-2xl font-extrabold text-slate-900">
        Shipping Information
      </h2>

      <div className="mt-6 space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Shipping Address"
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Place Order
        </button>
      </div>
    </form>
  );
}

export default CheckoutForm;