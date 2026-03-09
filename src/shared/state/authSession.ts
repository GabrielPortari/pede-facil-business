import { API_ENDPOINTS } from "../constants/apiEndpoints";

const ACCESS_TOKEN_STORAGE_KEY = "access_token";
const BUSINESS_ID_STORAGE_KEY = "business_id";
const SESSION_ACTIVE_STORAGE_KEY = "auth_session_active";
const LEGACY_BUSINESS_ID_KEYS = [
  "loggedId",
  "businessId",
  "company_id",
  "companyId",
] as const;

interface AuthSessionState {
  accessToken: string | null;
  businessId: string | null;
}

export const authSession: AuthSessionState = {
  accessToken: null,
  businessId: null,
};

let refreshPromise: Promise<string | null> | null = null;

function parseJwtPayload(token: string): unknown {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  try {
    return JSON.parse(atob(paddedBase64));
  } catch {
    return null;
  }
}

export function getAccessTokenFromAuthPayload(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const token =
    (
      value as {
        accessToken?: unknown;
        access_token?: unknown;
        idToken?: unknown;
        id_token?: unknown;
        token?: unknown;
      }
    ).accessToken ??
    (
      value as {
        accessToken?: unknown;
        access_token?: unknown;
        idToken?: unknown;
        id_token?: unknown;
        token?: unknown;
      }
    ).access_token ??
    (
      value as {
        accessToken?: unknown;
        access_token?: unknown;
        idToken?: unknown;
        id_token?: unknown;
        token?: unknown;
      }
    ).idToken ??
    (
      value as {
        accessToken?: unknown;
        access_token?: unknown;
        idToken?: unknown;
        id_token?: unknown;
        token?: unknown;
      }
    ).id_token ??
    (
      value as {
        accessToken?: unknown;
        access_token?: unknown;
        idToken?: unknown;
        id_token?: unknown;
        token?: unknown;
      }
    ).token;

  return typeof token === "string" && token.trim() ? token.trim() : null;
}

export function getAccessTokenFromNestedAuthPayload(
  value: unknown,
): string | null {
  const directToken = getAccessTokenFromAuthPayload(value);

  if (directToken) {
    return directToken;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const nestedDataToken = getAccessTokenFromAuthPayload(
    (value as { data?: unknown }).data,
  );

  if (nestedDataToken) {
    return nestedDataToken;
  }

  const nestedAuthToken = getAccessTokenFromAuthPayload(
    (value as { auth?: unknown }).auth,
  );

  if (nestedAuthToken) {
    return nestedAuthToken;
  }

  return null;
}

function getBusinessIdFromUnknownObject(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate =
    (
      value as {
        businessId?: unknown;
        business_id?: unknown;
        userId?: unknown;
        user_id?: unknown;
        uid?: unknown;
        sub?: unknown;
        loggedId?: unknown;
        companyId?: unknown;
        company_id?: unknown;
      }
    ).businessId ??
    (
      value as {
        businessId?: unknown;
        business_id?: unknown;
        userId?: unknown;
        user_id?: unknown;
        uid?: unknown;
        sub?: unknown;
        loggedId?: unknown;
        companyId?: unknown;
        company_id?: unknown;
      }
    ).business_id ??
    (
      value as {
        businessId?: unknown;
        business_id?: unknown;
        userId?: unknown;
        user_id?: unknown;
        uid?: unknown;
        sub?: unknown;
        loggedId?: unknown;
        companyId?: unknown;
        company_id?: unknown;
      }
    ).loggedId ??
    (
      value as {
        businessId?: unknown;
        business_id?: unknown;
        userId?: unknown;
        user_id?: unknown;
        uid?: unknown;
        sub?: unknown;
        loggedId?: unknown;
        companyId?: unknown;
        company_id?: unknown;
      }
    ).companyId ??
    (
      value as {
        businessId?: unknown;
        business_id?: unknown;
        userId?: unknown;
        user_id?: unknown;
        uid?: unknown;
        sub?: unknown;
        loggedId?: unknown;
        companyId?: unknown;
        company_id?: unknown;
      }
    ).company_id ??
    (
      value as {
        businessId?: unknown;
        business_id?: unknown;
        userId?: unknown;
        user_id?: unknown;
        uid?: unknown;
        sub?: unknown;
        loggedId?: unknown;
        companyId?: unknown;
        company_id?: unknown;
      }
    ).userId ??
    (
      value as {
        businessId?: unknown;
        business_id?: unknown;
        userId?: unknown;
        user_id?: unknown;
        uid?: unknown;
        sub?: unknown;
        loggedId?: unknown;
        companyId?: unknown;
        company_id?: unknown;
      }
    ).user_id ??
    (
      value as {
        businessId?: unknown;
        business_id?: unknown;
        userId?: unknown;
        user_id?: unknown;
        uid?: unknown;
        sub?: unknown;
        loggedId?: unknown;
        companyId?: unknown;
        company_id?: unknown;
      }
    ).uid ??
    (
      value as {
        businessId?: unknown;
        business_id?: unknown;
        userId?: unknown;
        user_id?: unknown;
        uid?: unknown;
        sub?: unknown;
        loggedId?: unknown;
        companyId?: unknown;
        company_id?: unknown;
      }
    ).sub;

  if (typeof candidate === "string" && candidate.trim()) {
    return candidate.trim();
  }

  const nestedBusiness = (value as { business?: unknown }).business;
  if (nestedBusiness && typeof nestedBusiness === "object") {
    const nestedBusinessId = (nestedBusiness as { id?: unknown }).id;

    if (typeof nestedBusinessId === "string" && nestedBusinessId.trim()) {
      return nestedBusinessId.trim();
    }
  }

  const nestedCompany = (value as { company?: unknown }).company;
  if (nestedCompany && typeof nestedCompany === "object") {
    const nestedCompanyId = (nestedCompany as { id?: unknown }).id;

    if (typeof nestedCompanyId === "string" && nestedCompanyId.trim()) {
      return nestedCompanyId.trim();
    }
  }

  return null;
}

function getBusinessIdFromAccessToken(
  accessToken: string | null,
): string | null {
  if (!accessToken) {
    return null;
  }

  return getBusinessIdFromUnknownObject(parseJwtPayload(accessToken));
}

export function getBusinessIdFromAuthPayload(
  value: unknown,
  fallbackAccessToken?: string | null,
): string | null {
  const fromPayload = getBusinessIdFromUnknownObject(value);

  if (fromPayload) {
    return fromPayload;
  }

  return getBusinessIdFromAccessToken(fallbackAccessToken ?? null);
}

function tryParseJson(value: string): unknown {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)?.trim() || null;
}

function setSessionActive(isActive: boolean): void {
  if (isActive) {
    localStorage.setItem(SESSION_ACTIVE_STORAGE_KEY, "1");
    return;
  }

  localStorage.removeItem(SESSION_ACTIVE_STORAGE_KEY);
}

export function isAuthenticatedSession(): boolean {
  return Boolean(localStorage.getItem(SESSION_ACTIVE_STORAGE_KEY));
}

export function getStoredBusinessId(): string | null {
  const primary = localStorage.getItem(BUSINESS_ID_STORAGE_KEY)?.trim();

  if (primary) {
    return primary;
  }

  for (const key of LEGACY_BUSINESS_ID_KEYS) {
    const value = localStorage.getItem(key)?.trim();

    if (value) {
      return value;
    }
  }

  return null;
}

export function syncAuthSessionFromStorage(): void {
  authSession.accessToken = getStoredAccessToken();
  authSession.businessId =
    getStoredBusinessId() ??
    getBusinessIdFromAccessToken(authSession.accessToken);
}

export function setStoredBusinessId(businessId: string | null): void {
  const normalizedBusinessId = businessId?.trim() || null;

  if (normalizedBusinessId) {
    localStorage.setItem(BUSINESS_ID_STORAGE_KEY, normalizedBusinessId);
    localStorage.setItem("loggedId", normalizedBusinessId);
  } else {
    localStorage.removeItem(BUSINESS_ID_STORAGE_KEY);
    localStorage.removeItem("loggedId");
  }

  authSession.businessId = normalizedBusinessId;
}

export function setStoredAccessToken(accessToken: string): void {
  const normalizedAccessToken = accessToken.trim();

  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, normalizedAccessToken);
  setSessionActive(true);
  authSession.accessToken = normalizedAccessToken;

  const derivedBusinessId = getBusinessIdFromAccessToken(normalizedAccessToken);

  if (derivedBusinessId) {
    setStoredBusinessId(derivedBusinessId);
  }
}

export function setAuthSession(params: {
  accessToken?: string | null;
  businessId?: string | null;
}): void {
  const accessToken = params.accessToken?.trim() || null;

  if (accessToken) {
    setStoredAccessToken(accessToken);
  } else {
    setSessionActive(true);
  }

  const explicitBusinessId = params.businessId?.trim() || null;

  if (explicitBusinessId) {
    setStoredBusinessId(explicitBusinessId);
  }
}

export function clearStoredAuthSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(BUSINESS_ID_STORAGE_KEY);
  localStorage.removeItem("loggedId");
  localStorage.removeItem(SESSION_ACTIVE_STORAGE_KEY);

  authSession.accessToken = null;
  authSession.businessId = null;
}

export function getLoggedBusinessId(): string | null {
  return authSession.businessId;
}

export function getLoggedBusinessIdOrThrow(): string {
  const businessId = authSession.businessId?.trim();

  if (!businessId) {
    throw new Error("Global logged business id not found");
  }

  return businessId;
}

async function requestRefreshAccessToken(): Promise<string | null> {
  const currentAccessToken = getStoredAccessToken();

  const response = await fetch(API_ENDPOINTS.auth.refreshAuth, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(currentAccessToken
        ? { Authorization: `Bearer ${currentAccessToken}` }
        : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearStoredAuthSession();
    }
    return null;
  }

  const rawBody = await response.text();
  const parsedBody = tryParseJson(rawBody);
  const refreshedAccessToken = getAccessTokenFromAuthPayload(parsedBody);

  if (!refreshedAccessToken) {
    return null;
  }

  const refreshedBusinessId = getBusinessIdFromAuthPayload(
    parsedBody,
    refreshedAccessToken,
  );

  setAuthSession({
    accessToken: refreshedAccessToken,
    businessId: refreshedBusinessId,
  });

  return refreshedAccessToken;
}

export async function refreshAccessToken(
  force = false,
): Promise<string | null> {
  if (!force && !getStoredAccessToken() && !isAuthenticatedSession()) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = requestRefreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function initializeAuthSession(): Promise<void> {
  syncAuthSessionFromStorage();

  if (!authSession.accessToken && !isAuthenticatedSession()) {
    return;
  }

  try {
    await refreshAccessToken();
  } catch {
    // Keep current token on startup failures; requests can retry/refresh later.
  }
}
