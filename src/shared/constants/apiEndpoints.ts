const baseUrl = "/api";

export const API_ENDPOINTS = {
  auth: {
    login: `${baseUrl}/auth/login`,
    signupBusiness: `${baseUrl}/auth/signup/business`,
    recoverPassword: `${baseUrl}/auth/recover-password`,
  },
  products: {
    create: `${baseUrl}/products`,
    promotion: (productId: string) =>
      `${baseUrl}/products/${productId}/promotion`,
  },
} as const;
