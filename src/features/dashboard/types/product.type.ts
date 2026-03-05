export interface MoneyPayload {
  amount: number;
  currency?: string;
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

export interface SubmitCreateProductResult {
  ok: boolean;
  data?: CreateProductResponse;
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
