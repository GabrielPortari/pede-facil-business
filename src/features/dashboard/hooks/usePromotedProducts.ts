import { useEffect, useState } from "react";
import { getBusinessPromotedProductsRequest } from "../services/productService";
import type { PromotedProduct } from "../types/product.type";

export function usePromotedProducts() {
  const [promotedProducts, setPromotedProducts] = useState<PromotedProduct[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function reloadPromotedProducts(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const nextProducts = await getBusinessPromotedProductsRequest();
      setPromotedProducts(Array.isArray(nextProducts) ? nextProducts : []);
    } catch (error) {
      console.error("[usePromotedProducts] Failed to load promoted products", {
        error,
      });

      setPromotedProducts([]);
      setErrorMessage("Não foi possível carregar os produtos em promoção.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void reloadPromotedProducts();
  }, []);

  return {
    promotedProducts,
    isLoading,
    errorMessage,
    reloadPromotedProducts,
  };
}
