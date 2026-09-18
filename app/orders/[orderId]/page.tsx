"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle, Package } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/apiClient";

import OrderHeader from "@/components/order-details/OrderHeader";
import OrderItems from "@/components/order-details/OrderItems";
import PaymentSummary from "@/components/order-details/PaymentSummary";
import ShippingInformation from "@/components/order-details/ShippingInformation";

import type {
  CancelOrderResponse,
  CustomerOrderDetails,
} from "@/types/order-details.types";

export default function OrderDetailsPage() {
  const params = useParams<{
    orderId: string;
  }>();

  const orderId = params.orderId;

  const [order, setOrder] = useState<CustomerOrderDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await api.get(`/api/orders/${orderId}`);

        setOrder(response.data as CustomerOrderDetails);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load order";

        toast.error("Could not load order", {
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

  async function handleCancelOrder() {
    if (!order || isCancelling) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsCancelling(true);

      const response = await api.patch(`/api/orders/${order.id}/cancel`, {});

      const cancelledOrder = response.data as CancelOrderResponse;

      setOrder((currentOrder) => {
        if (!currentOrder) {
          return currentOrder;
        }

        return {
          ...currentOrder,
          orderStatus: cancelledOrder.orderStatus,
          paymentStatus: cancelledOrder.paymentStatus,
        };
      });

      toast.success("Order cancelled successfully", {
        description: "Reserved product stock has been restored.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to cancel order";

      toast.error("Order cancellation failed", {
        description: message,
      });
    } finally {
      setIsCancelling(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Package className="mx-auto h-14 w-14 text-slate-300" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Order not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This order does not exist or does not belong to your account.
          </p>

          <Link
            href="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to orders
          </Link>
        </div>
      </main>
    );
  }

  const canCancelOrder =
    order.orderStatus === "pending" && order.paymentStatus === "pending";

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my orders
        </Link>

        <OrderHeader
          order={order}
          canCancel={canCancelOrder}
          isCancelling={isCancelling}
          onCancel={handleCancelOrder}
        />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <OrderItems items={order.items} currency={order.currency} />

            <ShippingInformation address={order.shippingAddress} />
          </div>

          <PaymentSummary order={order} />
        </div>
      </div>
    </main>
  );
}
