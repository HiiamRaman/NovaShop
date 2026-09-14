"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import AddressCard from "./AddressCard";
import EditAddressForm from "./EditAddressForm";

import type { AddressFormData } from "./EditAddressForm";
import type { ProfileAddress } from "@/types/profile.types";

interface ProfileAddressesProps {
  addresses: ProfileAddress[];
  onAddressUpdated: (address: ProfileAddress) => void;
  onAddressDeleted: (addressId: string) => void;
}

export default function ProfileAddresses({
  addresses,
  onAddressUpdated,
  onAddressDeleted,
}: ProfileAddressesProps) {
  const [editingAddress, setEditingAddress] = useState<ProfileAddress | null>(
    null
  );

  const [isSaving, setIsSaving] = useState(false);

  const [changingDefaultId, setChangingDefaultId] = useState<string | null>(
    null
  );

  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null
  );

  async function handleSaveAddress(data: AddressFormData) {
    if (!editingAddress) {
      return;
    }

    try {
      setIsSaving(true);

      const response = await api.patch(
        `/api/addresses/${editingAddress.id}`,
        data
      );

      const updatedAddress = response.data as ProfileAddress;

      onAddressUpdated(updatedAddress);
      setEditingAddress(null);

      toast.success("Address updated");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update address";

      toast.error("Update failed", {
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMakeDefault(addressId: string) {
    try {
      setChangingDefaultId(addressId);

      const response = await api.patch(`/api/addresses/${addressId}`, {
        isDefault: true,
      });

      const updatedAddress = response.data as ProfileAddress;

      onAddressUpdated(updatedAddress);

      toast.success("Default address updated");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to change default address";

      toast.error("Default address update failed", {
        description: message,
      });
    } finally {
      setChangingDefaultId(null);
    }
  }

  async function handleDeleteAddress(address: ProfileAddress) {
    const confirmed = window.confirm(
      `Delete the address for ${address.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAddressId(address.id);

      await api.delete(`/api/addresses/${address.id}`);

      onAddressDeleted(address.id);

      if (editingAddress?.id === address.id) {
        setEditingAddress(null);
      }

      toast.success("Address deleted");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete address";

      toast.error("Delete failed", {
        description: message,
      });
    } finally {
      setDeletingAddressId(null);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Saved Addresses</h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your delivery addresses
          </p>
        </div>

        <span className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {addresses.length}/3 saved
        </span>
      </div>

      {editingAddress && (
        <EditAddressForm
          key={editingAddress.id}
          address={editingAddress}
          isSaving={isSaving}
          onSave={handleSaveAddress}
          onCancel={() => setEditingAddress(null)}
        />
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isChangingDefault={changingDefaultId === address.id}
            isDeleting={deletingAddressId === address.id}
            onEdit={setEditingAddress}
            onMakeDefault={handleMakeDefault}
            onDelete={handleDeleteAddress}
          />
        ))}

        {addresses.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <MapPin className="mx-auto h-11 w-11 text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">
              No saved addresses
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Addresses created during checkout will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
