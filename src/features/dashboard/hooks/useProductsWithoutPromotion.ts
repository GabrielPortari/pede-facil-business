import { useEffect, useState } from "react";
import { getBusinessProductsWithoutPromotionRequest } from "../services/productService";
import type { BusinessProduct } from "../types/product.type";

export function useProductsWithoutPromotion() {
  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function reloadProducts(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const nextProducts = await getBusinessProductsWithoutPromotionRequest();
      setProducts(Array.isArray(nextProducts) ? nextProducts : []);
    } catch (error) {
      console.error("[useProductsWithoutPromotion] Failed to load products", {
        error,
      });

      setProducts([]);
      setErrorMessage("Não foi possível carregar os produtos sem promoção.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void reloadProducts();
  }, []);

  return {
    products,
    isLoading,
    errorMessage,
    reloadProducts,
  };
}
