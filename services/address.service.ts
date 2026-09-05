import {
  createAddress,
  removeCurrentDefaultAddress,
  findAddressesByUserId,
} from "@/repositories/address.repository";
import { CreateAddressData } from "@/types/address.types";

export async function addAddress(data: CreateAddressData) {
  const existingAddress = await findAddressesByUserId(data.userId);
  //first address automatically becomes default
  const shouldDefault = existingAddress.length === 0 || data.isDefault === true;
  if (shouldDefault) {
    await removeCurrentDefaultAddress(data.userId);
  }
  const newAddress = await createAddress({
    ...data,
    isDefault: shouldDefault,
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

export async function getMyAddresses(userId: string) {
  const addresses = await findAddressesByUserId(userId);
  return  addresses.map((address)=>(
    {
    id: address._id.toString(),
    fullName: address.fullName,
    phone: address.phone,
    city: address.city,
    address: address.address,
    isDefault: address.isDefault,
  }
  ))
}
