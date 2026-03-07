const baseUrl = "/api";

export const API_ENDPOINTS = {
  auth: {
    login: `${baseUrl}/auth/login`,
    signupBusiness: `${baseUrl}/auth/signup/business`,
    forgotPassword: `${baseUrl}/auth/forgot-password`,
  },
  products: {
    create: `${baseUrl}/products`,
    promotion: (productId: string) =>
      `${baseUrl}/products/${productId}/promotion`,
  },
} as const;
