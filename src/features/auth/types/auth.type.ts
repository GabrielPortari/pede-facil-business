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

export interface AuthMeAddress {
  address: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
}

export interface AuthMeTimestamp {
  seconds: number | null;
  nanoseconds: number | null;
  isoString: string | null;
}

export interface AuthMeProfile {
  id: string | null;
  name: string | null;
  legalName: string | null;
  email: string | null;
  contact: string | null;
  cnpj: string | null;
  website: string | null;
  logoUrl: string | null;
  verified: boolean | null;
  active: boolean | null;
  createdAt: AuthMeTimestamp;
  updatedAt: AuthMeTimestamp;
  address: AuthMeAddress;
  raw: unknown;
}

export interface UpdateBusinessAddressPayload {
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

export interface UpdateBusinessPayload {
  name?: string;
  email?: string;
  contact?: string;
  website?: string;
  logoUrl?: string;
  address?: UpdateBusinessAddressPayload;
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
