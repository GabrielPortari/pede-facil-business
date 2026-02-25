import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/getDashboardSummary";

export function useDashboardSummary() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getDashboardSummary()
      .then((result) => {
        if (isMounted) {
          setData(result);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    isLoading,
  };
}
