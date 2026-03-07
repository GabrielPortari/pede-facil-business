import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginCredentials,
  LoginResponse,
  SignupBusinessPayload,
  SignupBusinessResponse,
} from "../types/auth.type";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";
import { serviceRequest } from "../../../shared/lib/serviceRequest";

export async function loginRequest({
  email,
  password,
}: LoginCredentials): Promise<LoginResponse> {
  return serviceRequest<LoginResponse, LoginCredentials>(
    API_ENDPOINTS.auth.login,
    {
      method: "POST",
      body: { email, password },
      errorMessage: "Login failed",
    },
  );
}

export async function signupBusinessRequest(
  payload: SignupBusinessPayload,
): Promise<SignupBusinessResponse> {
  return serviceRequest<SignupBusinessResponse, SignupBusinessPayload>(
    API_ENDPOINTS.auth.signupBusiness,
    {
      method: "POST",
      body: payload,
      errorMessage: "Signup failed",
    },
  );
}

export async function forgotPasswordRequest(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  return serviceRequest<ForgotPasswordResponse, ForgotPasswordPayload>(
    API_ENDPOINTS.auth.forgotPassword,
    {
      method: "POST",
      body: payload,
      errorMessage: "Forgot password failed",
    },
  );
}
