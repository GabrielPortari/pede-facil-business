import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";
import {
  ServiceRequestError,
  serviceRequest,
} from "../../../shared/lib/serviceRequest";
import type {
  BusinessOrder,
  GetBusinessOrdersParams,
  OrderStatus,
} from "../types/order.type";

interface UpdateBusinessOrderStatusPayload {
  status: OrderStatus;
}

function clampOrderLimit(limit?: number): number {
  const fallbackLimit = 50;

  if (!Number.isInteger(limit)) {
    return fallbackLimit;
  }

  return Math.min(100, Math.max(1, limit as number));
}

function buildOrdersEndpoint(params?: GetBusinessOrdersParams): string {
  const searchParams = new URLSearchParams();

  if (params?.limit !== undefined) {
    const normalizedLimit = clampOrderLimit(params.limit);
    searchParams.set("limit", String(normalizedLimit));
  }

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();
  return query
    ? `${API_ENDPOINTS.orders.byAuthenticatedBusiness}?${query}`
    : API_ENDPOINTS.orders.byAuthenticatedBusiness;
}

export async function getBusinessOrdersRequest(
  params?: GetBusinessOrdersParams,
): Promise<BusinessOrder[]> {
  const endpoint = buildOrdersEndpoint(params);

  try {
    return await serviceRequest<BusinessOrder[]>(endpoint, {
      method: "GET",
      errorMessage: "Load orders failed",
    });
  } catch (error) {
    const shouldRetryWithoutQuery =
      error instanceof ServiceRequestError &&
      (error.status === 400 || error.status === 404) &&
      endpoint !== API_ENDPOINTS.orders.byAuthenticatedBusiness;

    if (!shouldRetryWithoutQuery) {
      throw error;
    }

    return serviceRequest<BusinessOrder[]>(
      API_ENDPOINTS.orders.byAuthenticatedBusiness,
      {
        method: "GET",
        errorMessage: "Load orders failed",
      },
    );
  }
}

export async function updateBusinessOrderStatusRequest(
  orderId: string,
  payload: UpdateBusinessOrderStatusPayload,
): Promise<BusinessOrder> {
  return serviceRequest<BusinessOrder, UpdateBusinessOrderStatusPayload>(
    API_ENDPOINTS.orders.statusByAuthenticatedBusiness(orderId),
    {
      method: "PATCH",
      body: payload,
      errorMessage: "Update order status failed",
    },
  );
}
