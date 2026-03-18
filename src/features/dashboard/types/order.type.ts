import type { MoneyPayload } from "./product.type";

export enum OrderStatus {
  PaymentPending = "payment_pending",
  PaidAwaitingDelivery = "paid_awaiting_delivery",
  Delivered = "delivered",
  CustomerConfirmed = "customer_confirmed",
  CustomerDeclined = "customer_declined",
  CustomerCancelled = "customer_cancelled",
  BusinessCancelled = "business_cancelled",
}

export enum OrderStatusFilterValue {
  All = "all",
}

export type OrderStatusFilter = OrderStatus | OrderStatusFilterValue.All;

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: MoneyPayload;
  quantity: number;
  subtotal: MoneyPayload;
}

export interface OrderTimestamp {
  _seconds?: number;
  _nanoseconds?: number;
}

export interface BusinessOrder {
  id: string;
  userId: string;
  userName?: string;
  businessId: string;
  items: OrderItem[];
  totalPrice: MoneyPayload;
  status: OrderStatus;
  paymentMethod: string;
  clientNotes: string | null;
  observations: string | null;
  clientOrderId: string;
  createdAt: OrderTimestamp;
  updatedAt: OrderTimestamp;
}

export interface GetBusinessOrdersParams {
  status?: OrderStatus;
  limit?: number;
}
