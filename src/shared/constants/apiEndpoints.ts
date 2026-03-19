const baseUrl = "/api";

export const API_ENDPOINTS = {
  auth: {
    login: `${baseUrl}/auth/login`,
    refreshAuth: `${baseUrl}/auth/refresh-auth`,
    signupBusiness: `${baseUrl}/auth/signup/business`,
    recoverPassword: `${baseUrl}/auth/recover-password`,
    me: `${baseUrl}/business/me`,
  },
  products: {
    createByBusiness: (businessId: string) =>
      `${baseUrl}/business/${businessId}/products`,
    availableByBusiness: (businessId: string) =>
      `${baseUrl}/business/${businessId}/products/available`,
    unavailableByBusiness: (businessId: string) =>
      `${baseUrl}/business/${businessId}/products/unavailable`,
    withoutPromotionsByBusiness: (businessId: string) =>
      `${baseUrl}/business/${businessId}/products/without-promotions`,
    byBusinessAndId: (businessId: string, productId: string) =>
      `${baseUrl}/business/${businessId}/products/${productId}`,
    promotionsByBusiness: (businessId: string) =>
      `${baseUrl}/business/${businessId}/products/promotions`,
    promotionByBusinessAndProduct: (businessId: string, productId: string) =>
      `${baseUrl}/business/${businessId}/products/${productId}/promotion`,
  },
  orders: {
    byAuthenticatedBusiness: `${baseUrl}/business/me/orders`,
    statusByAuthenticatedBusiness: (orderId: string) =>
      `${baseUrl}/business/me/orders/${orderId}/status`,
  },
} as const;
