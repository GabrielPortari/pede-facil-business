import type {
  BusinessProduct,
  CreateProductPayload,
  CreateProductResponse,
  DeleteProductResponse,
  PromotedProduct,
  UpdateProductPayload,
  UpdateProductPromotionPayload,
  UpdateProductPromotionResponse,
  UpdateProductResponse,
} from "../types/product.type";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";
import { serviceRequest } from "../../../shared/lib/serviceRequest";
import { getLoggedBusinessIdOrThrow } from "../../../shared/state/authSession";

export async function getBusinessProductsRequest(): Promise<BusinessProduct[]> {
  const businessId = getLoggedBusinessIdOrThrow();

  return serviceRequest<BusinessProduct[]>(
    API_ENDPOINTS.products.createByBusiness(businessId),
    {
      method: "GET",
      errorMessage: "Load products failed",
    },
  );
}

export async function getAvailableBusinessProductsRequest(): Promise<
  BusinessProduct[]
> {
  const businessId = getLoggedBusinessIdOrThrow();

  return serviceRequest<BusinessProduct[]>(
    API_ENDPOINTS.products.availableByBusiness(businessId),
    {
      method: "GET",
      errorMessage: "Load available products failed",
    },
  );
}

export async function getUnavailableBusinessProductsRequest(): Promise<
  BusinessProduct[]
> {
  const businessId = getLoggedBusinessIdOrThrow();

  return serviceRequest<BusinessProduct[]>(
    API_ENDPOINTS.products.unavailableByBusiness(businessId),
    {
      method: "GET",
      errorMessage: "Load unavailable products failed",
    },
  );
}

export async function getBusinessProductsWithoutPromotionRequest(): Promise<
  BusinessProduct[]
> {
  const businessId = getLoggedBusinessIdOrThrow();

  return serviceRequest<BusinessProduct[]>(
    API_ENDPOINTS.products.withoutPromotionsByBusiness(businessId),
    {
      method: "GET",
      errorMessage: "Load products without promotion failed",
    },
  );
}

export async function getBusinessPromotedProductsRequest(): Promise<
  PromotedProduct[]
> {
  const businessId = getLoggedBusinessIdOrThrow();

  return serviceRequest<PromotedProduct[]>(
    API_ENDPOINTS.products.promotionsByBusiness(businessId),
    {
      method: "GET",
      errorMessage: "Load promoted products failed",
    },
  );
}

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

export async function updateProductRequest(
  productId: string,
  payload: UpdateProductPayload,
): Promise<UpdateProductResponse> {
  const businessId = getLoggedBusinessIdOrThrow();

  return serviceRequest<UpdateProductResponse, UpdateProductPayload>(
    API_ENDPOINTS.products.byBusinessAndId(businessId, productId),
    {
      method: "PATCH",
      body: payload,
      errorMessage: "Update product failed",
    },
  );
}

export async function deleteProductRequest(
  productId: string,
): Promise<DeleteProductResponse> {
  const businessId = getLoggedBusinessIdOrThrow();

  return serviceRequest<DeleteProductResponse>(
    API_ENDPOINTS.products.byBusinessAndId(businessId, productId),
    {
      method: "DELETE",
      errorMessage: "Delete product failed",
    },
  );
}

export async function updateProductPromotionRequest(
  productId: string,
  payload: UpdateProductPromotionPayload,
): Promise<UpdateProductPromotionResponse> {
  const businessId = getLoggedBusinessIdOrThrow();

  return serviceRequest<
    UpdateProductPromotionResponse,
    UpdateProductPromotionPayload
  >(
    API_ENDPOINTS.products.promotionByBusinessAndProduct(businessId, productId),
    {
      method: "PATCH",
      body: payload,
      errorMessage: "Update promotion failed",
    },
  );
}
