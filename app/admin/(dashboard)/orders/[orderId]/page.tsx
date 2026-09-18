"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

import AdminOrderHeader from "@/components/admin/orders/AdminOrderHeader";
import AdminOrderItems from "@/components/admin/orders/AdminOrderItems";
import AdminPaymentSummary from "@/components/admin/orders/AdminPaymentSummary";
import AdminShippingAddress from "@/components/admin/orders/AdminShippingAddress";
import OrderStatusControl from "@/components/admin/orders/OrderStatusControl";

import type {
  AdminOrderDetails,
  NextOrderStatus,
  UpdateOrderStatusResponse,
} from "@/types/admin-order.types";

export default function AdminOrderDetailsPage() {
  const params = useParams<{
    orderId: string;
  }>();

  const orderId = params.orderId;

  const [order, setOrder] = useState<AdminOrderDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  /*
  Fetch the selected order when the page loads
  or when the URL order ID changes.
  */
  useEffect(() => {
    async function loadOrder() {
      try {
        setIsLoading(true);

        const response = await api.get(`/api/admin/orders/${orderId}`);

        const orderData = response.data as AdminOrderDetails;

        setOrder(orderData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load order";

        toast.error("Unable to load order", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  /*
  Move the order to its next valid status.

  pending -> confirmed
  confirmed -> shipped
  shipped -> delivered
  */
  async function handleUpdateStatus(nextStatus: NextOrderStatus) {
    if (!order || isUpdatingStatus) {
      return;
    }

    const shouldUpdate = window.confirm(
      `Change this order from ${order.orderStatus} to ${nextStatus}?`
    );

    if (!shouldUpdate) {
      return;
    }

    try {
      setIsUpdatingStatus(true);

      const response = await api.patch(`/api/admin/orders/${order.id}`, {
        orderStatus: nextStatus,
      });

      const updatedOrder = response.data as UpdateOrderStatusResponse;

      /*
      Update the local order state so the badge and
      workflow control change without refreshing.
      */
      setOrder((currentOrder) => {
        if (!currentOrder) {
          return currentOrder;
        }

        return {
          ...currentOrder,
          orderStatus: updatedOrder.orderStatus,
          paymentStatus: updatedOrder.paymentStatus,
        };
      });

      toast.success("Order status updated", {
        description: `Order is now ${updatedOrder.orderStatus}.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update order status";

      toast.error("Update failed", {
        description: message,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  if (isLoading) {
    return <OrderLoadingState />;
  }

  if (!order) {
    return <OrderNotFoundState />;
  }

  return (
    <section className="space-y-6">
      {/* Back navigation */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      {/* Order number, date and status badges */}
      <AdminOrderHeader
        orderId={order.id}
        createdAt={order.createdAt}
        orderStatus={order.orderStatus}
        paymentStatus={order.paymentStatus}
      />

      {/* Admin status workflow */}
      <OrderStatusControl
        orderStatus={order.orderStatus}
        paymentStatus={order.paymentStatus}
        isUpdating={isUpdatingStatus}
        onUpdate={handleUpdateStatus}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Ordered products */}
        <AdminOrderItems items={order.items} currency={order.currency} />

        <aside className="space-y-6">
          {/* Customer delivery information */}
          <AdminShippingAddress address={order.shippingAddress} />

          {/* Price totals */}
          <AdminPaymentSummary
            subtotal={order.subtotal}
            shipping={order.shipping}
            total={order.total}
            currency={order.currency}
          />
        </aside>
      </div>
    </section>
  );
}

function OrderLoadingState() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div
        role="status"
        aria-label="Loading order"
        className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
      />
    </div>
  );
}

function OrderNotFoundState() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Package className="h-14 w-14 text-slate-300" />

      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Order not found
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        This order may not exist or may no longer be available.
      </p>

      <Link
        href="/admin/orders"
        className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        Return to orders
      </Link>
    </section>
  );
}
