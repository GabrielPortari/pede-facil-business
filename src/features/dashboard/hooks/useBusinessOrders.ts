import { useEffect, useState } from "react";
import { getBusinessOrdersRequest } from "../services/orderService";
import type { BusinessOrder, OrderStatusFilter } from "../types/order.type";
import { ServiceRequestError } from "../../../shared/lib/serviceRequest";

function normalizeLimit(value: number): number {
  if (!Number.isInteger(value)) {
    return 50;
  }

  return Math.min(100, Math.max(1, value));
}

export function useBusinessOrders(status: OrderStatusFilter, limit: number) {
  const [orders, setOrders] = useState<BusinessOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function reloadOrders(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const nextOrders = await getBusinessOrdersRequest({
        status: status === "all" ? undefined : status,
        limit: normalizeLimit(limit) === 50 ? undefined : normalizeLimit(limit),
      });

      setOrders(Array.isArray(nextOrders) ? nextOrders : []);
    } catch (error) {
      console.error("[useBusinessOrders] Failed to load orders", {
        error,
      });

      setOrders([]);

      if (error instanceof ServiceRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível carregar os pedidos.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void reloadOrders();
  }, [status, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    orders,
    isLoading,
    errorMessage,
    reloadOrders,
  };
}
