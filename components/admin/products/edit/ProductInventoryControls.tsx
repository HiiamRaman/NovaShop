"use client";

import { useState } from "react";
import { Boxes, Eye, LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

import type { ProductStatus } from "@/types/products.types";

interface ProductInventoryControlsProps {
  productId: string;
  initialStock: number;
  initialStatus: ProductStatus;
  onStockUpdated: (stock: number) => void;
  onStatusUpdated: (status: ProductStatus) => void;
}

interface StockResponse {
  id: string;
  stock: number;
}

interface StatusResponse {
  id: string;
  status: ProductStatus;
}

export default function ProductInventoryControls({
  productId,
  initialStock,
  initialStatus,
  onStockUpdated,
  onStatusUpdated,
}: ProductInventoryControlsProps) {
  // Allow stock to be a string or number to handle the empty state while typing
  const [stock, setStock] = useState<number | string>(initialStock);
  const [status, setStatus] = useState<ProductStatus>(initialStatus);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  async function handleStockUpdate() {
    // Parse the stock value safely
    const parsedStock = Number(stock);

    // Check if it's an empty string, not an integer, or negative
    if (stock === "" || !Number.isInteger(parsedStock) || parsedStock < 0) {
      toast.error("Stock must be a non-negative whole number");
      return;
    }

    try {
      setIsUpdatingStock(true);

      const response = await api.patch(
        `/api/admin/products/${productId}/stock`,
        { stock: parsedStock }
      );

      const updatedProduct = response.data as StockResponse;
      setStock(updatedProduct.stock);
      onStockUpdated(updatedProduct.stock);
      toast.success("Product stock updated");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update stock";

      toast.error("Stock update failed", {
        description: message,
      });
    } finally {
      setIsUpdatingStock(false);
    }
  }

  async function handleStatusUpdate() {
    try {
      setIsUpdatingStatus(true);

      const response = await api.patch(
        `/api/admin/products/${productId}/status`,
        { status }
      );

      const updatedProduct = response.data as StatusResponse;
      setStatus(updatedProduct.status);
      onStatusUpdated(updatedProduct.status);

      toast.success("Product status updated", {
        description: `Product is now ${updatedProduct.status}.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update status";

      toast.error("Status update failed", {
        description: message,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Stock management */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Boxes className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Inventory</h3>
            <p className="text-xs text-slate-500">Manage available quantity</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Available stock
            <input
              type="number"
              min={0}
              step={1}
              value={stock}
              onChange={(event) => {
                const value = event.target.value;
                // Allow empty string so the user can clear the input
                setStock(value === "" ? "" : Number(value));
              }}
              className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <button
            type="button"
            disabled={isUpdatingStock}
            onClick={handleStockUpdate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingStock ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isUpdatingStock ? "Updating..." : "Update Stock"}
          </button>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* Status management */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Visibility</h3>
            <p className="text-xs text-slate-500">Control product status</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Status
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ProductStatus)
              }
              className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <StatusExplanation status={status} />

          <button
            type="button"
            disabled={isUpdatingStatus}
            onClick={handleStatusUpdate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingStatus ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isUpdatingStatus ? "Updating..." : "Update Status"}
          </button>
        </div>
      </section>
    </div>
  );
}

interface StatusExplanationProps {
  status: ProductStatus;
}

function StatusExplanation({ status }: StatusExplanationProps) {
  const messages: Record<ProductStatus, string> = {
    draft: "Hidden from the customer storefront.",
    active: "Visible and available for purchase.",
    archived: "Removed from store, preserved in admin.",
  };

  return (
    <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
      <span className="font-medium text-slate-700 capitalize">{status}: </span>
      {messages[status]}
    </p>
  );
}
