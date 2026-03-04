import type {
  LoginCredentials,
  LoginResponse,
  SignupBusinessPayload,
  SignupBusinessResponse,
} from "../types/auth.type";

export async function loginRequest({
  email,
  password,
}: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json() as Promise<LoginResponse>;
}

export async function signupBusinessRequest(
  payload: SignupBusinessPayload,
): Promise<SignupBusinessResponse> {
  const response = await fetch("/api/auth/signup/business", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json() as Promise<SignupBusinessResponse>;
}
