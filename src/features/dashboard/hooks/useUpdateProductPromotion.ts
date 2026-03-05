import { useState } from "react";
import { updateProductPromotionRequest } from "../services/productService";
import type {
  SubmitUpdateProductPromotionResult,
  UpdateProductPromotionPayload,
} from "../types/product.type";

export function useUpdateProductPromotion() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submitPromotion(
    productId: string,
    payload: UpdateProductPromotionPayload,
  ): Promise<SubmitUpdateProductPromotionResult> {
    try {
      setIsLoading(true);
      setServerError("");
      setSuccessMessage("");

      const result = await updateProductPromotionRequest(productId, payload);
      setSuccessMessage("Promoção aplicada com sucesso.");

      return { ok: true, data: result };
    } catch {
      setServerError("Não foi possível aplicar a promoção.");
      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    serverError,
    successMessage,
    submitPromotion,
    setSuccessMessage,
  };
}
