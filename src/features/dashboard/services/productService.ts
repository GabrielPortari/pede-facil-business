import type {
  CreateProductPayload,
  CreateProductResponse,
  UpdateProductPromotionPayload,
  UpdateProductPromotionResponse,
} from "../types/product.type";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";
import { serviceRequest } from "../../../shared/lib/serviceRequest";

export async function createProductRequest(
  payload: CreateProductPayload,
): Promise<CreateProductResponse> {
  return serviceRequest<CreateProductResponse, CreateProductPayload>(
    API_ENDPOINTS.products.create,
    {
      method: "POST",
      body: payload,
      errorMessage: "Create product failed",
    },
  );
}

export async function updateProductPromotionRequest(
  productId: string,
  payload: UpdateProductPromotionPayload,
): Promise<UpdateProductPromotionResponse> {
  return serviceRequest<
    UpdateProductPromotionResponse,
    UpdateProductPromotionPayload
  >(API_ENDPOINTS.products.promotion(productId), {
    method: "PATCH",
    body: payload,
    errorMessage: "Update promotion failed",
  });
}
