import type { MoneyPayload } from "./product.type";

export type OrderStatus =
  | "payment_pending"
  | "paid_awaiting_delivery"
  | "delivered"
  | "customer_confirmed"
  | "customer_cancelled"
  | "business_cancelled";

export type OrderStatusFilter = OrderStatus | "all";

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
