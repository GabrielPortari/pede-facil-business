import type {
  CreateProductPayload,
  CreateProductResponse,
  UpdateProductPromotionPayload,
  UpdateProductPromotionResponse,
} from "../types/product.type";

export async function createProductRequest(
  payload: CreateProductPayload,
): Promise<CreateProductResponse> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Create product failed");
  }

  return response.json() as Promise<CreateProductResponse>;
}

export async function updateProductPromotionRequest(
  productId: string,
  payload: UpdateProductPromotionPayload,
): Promise<UpdateProductPromotionResponse> {
  const response = await fetch(`/api/products/${productId}/promotion`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Update promotion failed");
  }

  return response.json() as Promise<UpdateProductPromotionResponse>;
}
