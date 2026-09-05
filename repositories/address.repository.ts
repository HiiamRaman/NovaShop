import { Address } from "@/models/address.model";

import type { CreateAddressData } from "@/types/address.types";
// Save a new address in MongoDB.
export async function createAddress(data: CreateAddressData) {
  return Address.create(data);
}
// Get all addresses belonging to one user.
export async function findAddressesByUserId(userId: string) {
  return Address.find({ userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });
}

// Change the user's current default address to false.

export async function removeCurrentDefaultAddress(userId: string) {
  return Address.updateMany(
    { userId, isDefault: true },
    {
      $set: {
        isDefault: false,
      },
    }
  );
}
