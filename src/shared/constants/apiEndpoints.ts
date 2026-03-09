const baseUrl = "/api";

export const API_ENDPOINTS = {
  auth: {
    login: `${baseUrl}/auth/login`,
    refreshAuth: `${baseUrl}/auth/refresh-auth`,
    signupBusiness: `${baseUrl}/auth/signup/business`,
    recoverPassword: `${baseUrl}/auth/recover-password`,
  },
  products: {
    createByBusiness: (businessId: string) =>
      `${baseUrl}/business/${businessId}/products`,
    promotion: (productId: string) =>
      `${baseUrl}/products/${productId}/promotion`,
  },
} as const;
