import { useState } from "react";
import { updateProductRequest } from "../services/productService";
import type {
  SubmitUpdateProductResult,
  UpdateProductPayload,
} from "../types/product.type";

export function useUpdateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submitUpdate(
    productId: string,
    payload: UpdateProductPayload,
  ): Promise<SubmitUpdateProductResult> {
    try {
      setIsLoading(true);
      setServerError("");
      setSuccessMessage("");

      const result = await updateProductRequest(productId, payload);
      setSuccessMessage("Produto atualizado com sucesso.");

      return { ok: true, data: result };
    } catch {
      setServerError("Não foi possível atualizar o produto.");
      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    serverError,
    successMessage,
    submitUpdate,
    setSuccessMessage,
  };
}
