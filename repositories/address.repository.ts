import { Address } from "@/models/address.model";

import type {
  CreateAddressData,
  UpdateAddressData,
} from "@/types/address.types";

// Save a new address.
export async function createAddress(
  data: CreateAddressData
) {
  return Address.create(data);
}

// Count the addresses belonging to one user.
export async function countAddressesByUserId(
  userId: string
) {
  return Address.countDocuments({ userId });
}

// Get all addresses belonging to one user.
export async function findAddressesByUserId(
  userId: string
) {
  return Address.find({ userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });
}

export async function removeCurrentDefaultAddress(
  userId: string
) {
  return Address.updateMany(
    {
      userId,
      isDefault: true,
    },
    {
      $set: {
        isDefault: false,
      },
    }
  );
}

export async function findAddressByIdAndUserId(
  addressId: string,
  userId: string
) {
  return Address.findOne({
    _id: addressId,
    userId,
  });
}

export async function updateAddressByIdAndUserId(
  addressId: string,
  userId: string,
  data: UpdateAddressData
) {
  return Address.findOneAndUpdate(
    {
      _id: addressId,
      userId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}
export async function deleteAddressByIdAndUserId(
  addressId: string,
  userId: string
) {
  return Address.findOneAndDelete({
    _id: addressId,
    userId,
  });
}

export async function setAddressAsDefault(
  addressId: string,
  userId: string
) {
  return Address.findOneAndUpdate(
    {
      _id: addressId,
      userId,
    },
    {
      $set: {
        isDefault: true,
      },
    },
    {
      new: true,
    }
  );
}
