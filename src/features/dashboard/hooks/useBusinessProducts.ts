import { useEffect, useState } from "react";
import { getBusinessProductsRequest } from "../services/productService";
import type { BusinessProduct } from "../types/product.type";

export function useBusinessProducts() {
  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function reloadProducts(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const nextProducts = await getBusinessProductsRequest();
      setProducts(Array.isArray(nextProducts) ? nextProducts : []);
    } catch (error) {
      console.error("[useBusinessProducts] Failed to load products", {
        error,
      });

      setProducts([]);
      setErrorMessage("Não foi possível carregar os produtos cadastrados.");
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
