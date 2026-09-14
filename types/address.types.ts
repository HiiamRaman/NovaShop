export interface CreateAddressData {
  userId: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  isDefault: boolean;
}


export interface UpdateAddressData {
  fullName?: string;
  phone?: string;
  city?: string;
  address?: string;
  isDefault?: boolean;
}


