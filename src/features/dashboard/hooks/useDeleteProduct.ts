import { useState } from "react";
import { deleteProductRequest } from "../services/productService";
import type { SubmitDeleteProductResult } from "../types/product.type";

export function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function submitDelete(
    productId: string,
  ): Promise<SubmitDeleteProductResult> {
    try {
      setIsLoading(true);
      setServerError("");

      const result = await deleteProductRequest(productId);
      return { ok: true, data: result };
    } catch {
      setServerError("Não foi possível excluir o produto.");
      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    serverError,
    submitDelete,
    setServerError,
  };
}
