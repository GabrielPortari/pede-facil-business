export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BusinessAddressPayload {
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface SignupBusinessPayload {
  name: string;
  legalName: string;
  cnpj: string;
  logoUrl?: string;
  website?: string;
  address: BusinessAddressPayload;
  contact: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  [key: string]: unknown;
}

export interface SignupBusinessResponse {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message?: string;
  [key: string]: unknown;
}

export type SubmitLoginResult =
  | { ok: true; data: LoginResponse }
  | { ok: false };

export type SubmitSignupBusinessResult =
  | { ok: true; data: SignupBusinessResponse }
  | { ok: false };

export type SubmitForgotPasswordResult =
  | { ok: true; data: ForgotPasswordResponse }
  | { ok: false };
