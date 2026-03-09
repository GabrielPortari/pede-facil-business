import type {
  CreateProductPayload,
  CreateProductResponse,
  UpdateProductPromotionPayload,
  UpdateProductPromotionResponse,
} from "../types/product.type";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";
import { serviceRequest } from "../../../shared/lib/serviceRequest";
import { getLoggedBusinessIdOrThrow } from "../../../shared/state/authSession";

export async function createProductRequest(
  payload: CreateProductPayload,
): Promise<CreateProductResponse> {
  const businessId = getLoggedBusinessIdOrThrow();

  return serviceRequest<CreateProductResponse, CreateProductPayload>(
    API_ENDPOINTS.products.createByBusiness(businessId),
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
