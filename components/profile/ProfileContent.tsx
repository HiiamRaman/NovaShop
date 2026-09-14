"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";
import ProfileSidebar from "./ProfileSidebar";
import PersonalInformation from "./PersonalInformation";
import ProfileOrders from "./ProfileOrders";
import ProfileAddresses from "./ProfileAddresses";
import ChangePasswordForm from "./ChangePasswordForm";
import type {
  CurrentUser,
  ProfileAddress,
  ProfileOrder,
  ProfileTab,
} from "@/types/profile.types";

export default function ProfileContent() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");

  const [user, setUser] = useState<CurrentUser | null>(null);

  const [orders, setOrders] = useState<ProfileOrder[]>([]);

  const [addresses, setAddresses] = useState<ProfileAddress[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        // Load the user's profile data in parallel.
        const [userResponse, ordersResponse, addressesResponse] =
          await Promise.all([
            api.get("/api/auth/me"),
            api.get("/api/orders"),
            api.get("/api/addresses"),
          ]);

        setUser(userResponse.data as CurrentUser);

        setOrders(ordersResponse.data as ProfileOrder[]);

        setAddresses(addressesResponse.data as ProfileAddress[]);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load profile";

        toast.error("Profile unavailable", {
          description: message,
        });

        // The profile page requires authentication.
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  // Update one address in the parent state.
  function handleAddressUpdated(updatedAddress: ProfileAddress) {
    setAddresses((currentAddresses) => {
      const updatedAddresses = currentAddresses.map((address) => {
        if (address.id === updatedAddress.id) {
          return updatedAddress;
        }

        // Only one address can be default.
        if (updatedAddress.isDefault) {
          return {
            ...address,
            isDefault: false,
          };
        }

        return address;
      });

      // Keep the default address at the top.
      return updatedAddresses.sort(
        (first, second) => Number(second.isDefault) - Number(first.isDefault)
      );
    });
  }

  // Remove the deleted address from the UI.
  function handleAddressDeleted(addressId: string) {
    setAddresses((currentAddresses) => {
      const deletedAddress = currentAddresses.find(
        (address) => address.id === addressId
      );

      const remainingAddresses = currentAddresses.filter(
        (address) => address.id !== addressId
      );

      // The backend promotes another address when
      // the default address is deleted.
      // Reflect the same change immediately in the UI.
      if (deletedAddress?.isDefault && remainingAddresses.length > 0) {
        return remainingAddresses.map((address, index) => ({
          ...address,
          isDefault: index === 0,
        }));
      }

      return remainingAddresses;
    });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
      <ProfileSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <section className="min-w-0">
        {activeTab === "personal" && (
          <PersonalInformation user={user} orders={orders} />
        )}

        {activeTab === "orders" && <ProfileOrders orders={orders} />}

        {activeTab === "addresses" && (
          <ProfileAddresses
            addresses={addresses}
            onAddressUpdated={handleAddressUpdated}
            onAddressDeleted={handleAddressDeleted}
          />
        )}
        {activeTab === "security" && <ChangePasswordForm />}
      </section>
    </div>
  );
}
