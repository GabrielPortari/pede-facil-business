import { useState } from "react";
import { createProductRequest } from "../services/productService";
import type {
  CreateProductPayload,
  SubmitCreateProductResult,
} from "../types/product.type";

export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submitProduct(
    payload: CreateProductPayload,
  ): Promise<SubmitCreateProductResult> {
    try {
      setIsLoading(true);
      setServerError("");
      setSuccessMessage("");

      const result = await createProductRequest(payload);
      setSuccessMessage("Produto cadastrado com sucesso.");

      return { ok: true, data: result };
    } catch {
      setServerError("Não foi possível cadastrar o produto.");
      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    serverError,
    successMessage,
    submitProduct,
    setSuccessMessage,
  };
}
