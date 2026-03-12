export interface MoneyPayload {
  amount: number;
  currency?: string;
}

export interface ProductTimestamp {
  _seconds?: number;
  _nanoseconds?: number;
}

export interface BusinessProduct {
  id: string;
  createdAt?: ProductTimestamp;
  updatedAt?: ProductTimestamp;
  businessId: string;
  name: string;
  description?: string;
  price: MoneyPayload;
  available?: boolean;
  stock?: number;
  useStock?: boolean;
  imageUrl?: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: MoneyPayload;
  imageUrl?: string;
  available?: boolean;
  stock?: number;
  useStock?: boolean;
}

export interface CreateProductResponse {
  id: string;
  name: string;
}

export interface UpdateProductPayload {
  name: string;
  description?: string;
  price: MoneyPayload;
  imageUrl?: string;
  available?: boolean;
  stock?: number;
  useStock?: boolean;
}

export interface UpdateProductResponse {
  id: string;
  name: string;
}

export interface DeleteProductResponse {
  id?: string;
  message?: string;
}

export interface SubmitCreateProductResult {
  ok: boolean;
  data?: CreateProductResponse;
}

export interface SubmitUpdateProductResult {
  ok: boolean;
  data?: UpdateProductResponse;
}

export interface SubmitDeleteProductResult {
  ok: boolean;
  data?: DeleteProductResponse;
}

export interface SubmitLoadBusinessProductsResult {
  ok: boolean;
  data?: BusinessProduct[];
}

export type PromotionType = "percentage" | "fixed";

export interface UpdateProductPromotionPayload {
  active: boolean;
  type?: PromotionType;
  percentage?: number;
  amount?: MoneyPayload;
  usePromotionStock?: boolean;
  promotionStock?: number;
}

export interface UpdateProductPromotionResponse {
  id: string;
  active: boolean;
}

export interface SubmitUpdateProductPromotionResult {
  ok: boolean;
  data?: UpdateProductPromotionResponse;
}
