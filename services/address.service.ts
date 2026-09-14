import {
  createAddress,
  removeCurrentDefaultAddress,
  findAddressesByUserId,
  findAddressByIdAndUserId,
  updateAddressByIdAndUserId,
  countAddressesByUserId,
  deleteAddressByIdAndUserId,
  setAddressAsDefault,
} from "@/repositories/address.repository";
import { CreateAddressData, UpdateAddressData } from "@/types/address.types";
import { ApiError } from "@/utils/ApiError";
import mongoose from "mongoose";

export async function getMyAddresses(userId: string) {
  const addresses = await findAddressesByUserId(userId);
  return addresses.map((address) => ({
    id: address._id.toString(),
    fullName: address.fullName,
    phone: address.phone,
    city: address.city,
    address: address.address,
    isDefault: address.isDefault,
  }));
}

export async function updateMyAddress(
  userId: string,
  addressId: string,
  data: UpdateAddressData
) {
  // Prevent a Mongoose CastError.
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }
  // Confirm that this address belongs to the user.
  const existingAddress = await findAddressByIdAndUserId(addressId, userId);
  if (!existingAddress) {
    throw new ApiError(400, "Address not found");
  }
  /*
   * If this address becomes default,
   * remove the default status from other addresses.
   */

  if (data.isDefault === true) {
    await removeCurrentDefaultAddress(userId);
  }

  const updatedAddress = await updateAddressByIdAndUserId(
    addressId,
    userId,
    data
  );
  if (!updatedAddress) {
    throw new ApiError(404, "Address not found");
  }

  return formatAddress(updatedAddress);
}

// Keep the API response shape consistent.

function formatAddress(address: {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  isDefault: boolean;
}) {
  return {
    id: address._id.toString(),
    fullName: address.fullName,
    phone: address.phone,
    city: address.city,
    address: address.address,
    isDefault: address.isDefault,
  };
}

const MAX_ADDRESSES_PER_USER = 3;

export async function addAddress(data: CreateAddressData) {
  // Count without loading every address document.
  const addressCount = await countAddressesByUserId(data.userId);

  if (addressCount >= MAX_ADDRESSES_PER_USER) {
    throw new ApiError(
      409,
      `You can save a maximum of ${MAX_ADDRESSES_PER_USER} addresses`
    );
  }

  // The first address automatically becomes default.
  const shouldBeDefault = addressCount === 0 || data.isDefault === true;

  if (shouldBeDefault) {
    await removeCurrentDefaultAddress(data.userId);
  }

  const newAddress = await createAddress({
    ...data,
    isDefault: shouldBeDefault,
  });

  return {
    id: newAddress._id.toString(),
    fullName: newAddress.fullName,
    phone: newAddress.phone,
    city: newAddress.city,
    address: newAddress.address,
    isDefault: newAddress.isDefault,
  };
}

export async function deleteMyAddress(userId: string, addressId: string) {
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }

  // Ownership is checked in the repository query.
  const deletedAddress = await deleteAddressByIdAndUserId(addressId, userId);

  if (!deletedAddress) {
    throw new ApiError(404, "Address not found");
  }

  // If the default address was deleted,
  // make the first remaining address default.
  if (deletedAddress.isDefault) {
    const remainingAddresses = await findAddressesByUserId(userId);

    const nextAddress = remainingAddresses[0];

    if (nextAddress) {
      await setAddressAsDefault(nextAddress._id.toString(), userId);
    }
  }

  return {
    id: deletedAddress._id.toString(),
  };
}
