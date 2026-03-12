import { useEffect, useState } from "react";
import {
  getAvailableBusinessProductsRequest,
  getBusinessProductsRequest,
  getUnavailableBusinessProductsRequest,
} from "../services/productService";
import type { BusinessProduct } from "../types/product.type";

export type ProductAvailabilityFilter = "all" | "available" | "unavailable";

export function useBusinessProducts(filter: ProductAvailabilityFilter = "all") {
  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function reloadProducts(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      let nextProducts: BusinessProduct[];

      if (filter === "available") {
        nextProducts = await getAvailableBusinessProductsRequest();
      } else if (filter === "unavailable") {
        nextProducts = await getUnavailableBusinessProductsRequest();
      } else {
        nextProducts = await getBusinessProductsRequest();
      }

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
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    isLoading,
    errorMessage,
    reloadProducts,
  };
}
