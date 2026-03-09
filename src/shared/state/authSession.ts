import { API_ENDPOINTS } from "../constants/apiEndpoints";

const ACCESS_TOKEN_STORAGE_KEY = "access_token";
let refreshPromise: Promise<string | null> | null = null;

function extractAccessToken(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const token =
    (
      value as {
        accessToken?: unknown;
        access_token?: unknown;
        token?: unknown;
      }
    ).accessToken ??
    (
      value as {
        accessToken?: unknown;
        access_token?: unknown;
        token?: unknown;
      }
    ).access_token ??
    (
      value as {
        accessToken?: unknown;
        access_token?: unknown;
        token?: unknown;
      }
    ).token;

  return typeof token === "string" && token.trim() ? token.trim() : null;
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

export function setStoredAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export function clearStoredAuthSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

async function requestRefreshAccessToken(): Promise<string | null> {
  const currentAccessToken = getStoredAccessToken();

  if (!currentAccessToken) {
    return null;
  }

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
  const refreshedAccessToken = extractAccessToken(parsedBody);

  if (!refreshedAccessToken) {
    return null;
  }

  setStoredAccessToken(refreshedAccessToken);
  return refreshedAccessToken;
}

export async function refreshAccessToken(): Promise<string | null> {
  if (!getStoredAccessToken()) {
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
  if (!getStoredAccessToken()) {
    return;
  }

  try {
    await refreshAccessToken();
  } catch {
    // Keep current token on startup failures; requests can retry/refresh later.
  }
}
