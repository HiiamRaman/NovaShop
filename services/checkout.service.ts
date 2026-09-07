import mongoose from "mongoose";

import { findAddressByIdAndUserId } from "@/repositories/address.repository";
import { findProductsByIds } from "@/repositories/product.repository";
import { ApiError } from "@/utils/ApiError";

interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

/*
1. Confirm the address belongs to the user
2. Fetch the current products
3. Check product status and stock
4. Calculate prices using MongoDB data
5. Return the checkout summary
*/
export async function validateCheckout(
  userId: string,
  addressId: string,
  items: CheckoutItemInput[]
) {
  // Validate the address ID.
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }

  // Confirm the address belongs to the logged-in user.
  const address = await findAddressByIdAndUserId(
    addressId,
    userId
  );

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Validate every product ID.
  const hasInvalidProductId = items.some(
    (item) =>
      !mongoose.Types.ObjectId.isValid(item.productId)
  );

  if (hasInvalidProductId) {
    throw new ApiError(400, "Invalid product ID");
  }

  // Extract product IDs from the cart items.
  const productIds = items.map((item) => item.productId);

  // Fetch current product information from MongoDB.
  const products = await findProductsByIds(productIds);

  // Detect deleted or nonexistent products.
  if (products.length !== items.length) {
    throw new ApiError(
      400,
      "One or more products are unavailable"
    );
  }

  // Use the first product's currency for checkout.
  const currency = products[0].currency;

  // Prevent products with different currencies in one order.
  const hasDifferentCurrency = products.some(
    (product) => product.currency !== currency
  );

  if (hasDifferentCurrency) {
    throw new ApiError(
      400,
      "All products must use the same currency"
    );
  }

  // Create the checkout items and calculate line totals.
  const checkoutItems = items.map((item) => {
    const product = products.find(
      (product) =>
        product._id.toString() === item.productId
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.status !== "active") {
      throw new ApiError(
        400,
        `${product.name} is not available`
      );
    }

    if (item.quantity > product.stock) {
      throw new ApiError(
        400,
        `Only ${product.stock} units of ${product.name} are available`
      );
    }

    return {
      productId: product._id.toString(),
      name: product.name,
      image: product.images[0]?.url ?? null,
      quantity: item.quantity,
      unitPrice: product.priceInMinorUnit,
      lineTotal: product.priceInMinorUnit * item.quantity,
    };
  });

  // Calculate the subtotal.
  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.lineTotal,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  return {
    address: {
      id: address._id.toString(),
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      address: address.address,
    },
    items: checkoutItems,
    subtotal,
    shipping,
    total,
    currency,
  };
}
