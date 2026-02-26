export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  [key: string]: unknown;
}

export type SubmitLoginResult =
  | { ok: true; data: LoginResponse }
  | { ok: false };
