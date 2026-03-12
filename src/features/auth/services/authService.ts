import type {
  AuthMeProfile,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginCredentials,
  LoginResponse,
  SignupBusinessPayload,
  SignupBusinessResponse,
  UpdateBusinessPayload,
} from "../types/auth.type";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";
import { serviceRequest } from "../../../shared/lib/serviceRequest";
import { fetchAuthenticatedBusiness } from "../../../shared/state/authSession";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function getStringValue(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getBooleanValue(...values: unknown[]): boolean | null {
  for (const value of values) {
    if (typeof value === "boolean") {
      return value;
    }
  }

  return null;
}

function getNumberValue(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function normalizeTimestamp(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    const parsedDate = new Date(value);

    return {
      seconds: null,
      nanoseconds: null,
      isoString: Number.isNaN(parsedDate.getTime())
        ? value
        : parsedDate.toISOString(),
    };
  }

  const timestampRecord = asRecord(value);
  const seconds = getNumberValue(
    timestampRecord?._seconds,
    timestampRecord?.seconds,
  );
  const nanoseconds = getNumberValue(
    timestampRecord?._nanoseconds,
    timestampRecord?.nanoseconds,
  );

  if (seconds === null) {
    return {
      seconds: null,
      nanoseconds: null,
      isoString: null,
    };
  }

  const timestampInMilliseconds =
    seconds * 1000 + Math.floor((nanoseconds ?? 0) / 1000000);

  return {
    seconds,
    nanoseconds,
    isoString: new Date(timestampInMilliseconds).toISOString(),
  };
}

function getEntityCandidate(value: unknown): UnknownRecord | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const nestedData = asRecord(record.data);

  return (
    asRecord(nestedData?.business) ??
    asRecord(nestedData?.company) ??
    nestedData ??
    asRecord(record.business) ??
    asRecord(record.company) ??
    record
  );
}

function getAddressCandidate(
  payload: unknown,
  entity: UnknownRecord | null,
): UnknownRecord | null {
  const payloadRecord = asRecord(payload);
  const nestedData = asRecord(payloadRecord?.data);

  return (
    asRecord(entity?.address) ??
    asRecord(nestedData?.address) ??
    asRecord(payloadRecord?.address) ??
    null
  );
}

export async function getAuthenticatedBusinessProfile(): Promise<AuthMeProfile> {
  const payload = await fetchAuthenticatedBusiness();
  const entity = getEntityCandidate(payload);
  const address = getAddressCandidate(payload, entity);

  return {
    id: getStringValue(
      entity?.id,
      entity?.businessId,
      entity?.business_id,
      entity?.companyId,
      entity?.company_id,
    ),
    name: getStringValue(
      entity?.name,
      entity?.businessName,
      entity?.companyName,
    ),
    legalName: getStringValue(entity?.legalName, entity?.legal_name),
    email: getStringValue(entity?.email),
    contact: getStringValue(entity?.contact, entity?.phone, entity?.telephone),
    cnpj: getStringValue(entity?.cnpj, entity?.document),
    website: getStringValue(entity?.website, entity?.site),
    logoUrl: getStringValue(entity?.logoUrl, entity?.logo_url, entity?.avatar),
    verified: getBooleanValue(entity?.verified),
    active: getBooleanValue(entity?.active),
    createdAt: normalizeTimestamp(entity?.createdAt ?? entity?.created_at),
    updatedAt: normalizeTimestamp(entity?.updatedAt ?? entity?.updated_at),
    address: {
      address: getStringValue(address?.address, address?.street),
      number: getStringValue(address?.number),
      complement: getStringValue(address?.complement),
      neighborhood: getStringValue(address?.neighborhood),
      city: getStringValue(address?.city),
      state: getStringValue(address?.state),
      zipcode: getStringValue(address?.zipcode, address?.zipCode, address?.cep),
    },
    raw: payload,
  };
}

export async function updateBusinessProfile(
  payload: UpdateBusinessPayload,
): Promise<unknown> {
  return serviceRequest<unknown, UpdateBusinessPayload>(API_ENDPOINTS.auth.me, {
    method: "PATCH",
    body: payload,
    errorMessage: "Update failed",
  });
}

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
    API_ENDPOINTS.auth.recoverPassword,
    {
      method: "POST",
      body: payload,
      errorMessage: "Forgot password failed",
    },
  );
}
