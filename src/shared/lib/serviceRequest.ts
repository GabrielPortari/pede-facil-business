type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ServiceRequestOptions<TBody> {
  method: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  errorMessage?: string;
}

export class ServiceRequestError extends Error {
  status: number;
  endpoint: string;
  method: HttpMethod;
  responseBody: unknown;

  constructor(params: {
    message: string;
    status: number;
    endpoint: string;
    method: HttpMethod;
    responseBody: unknown;
  }) {
    super(params.message);
    this.name = "ServiceRequestError";
    this.status = params.status;
    this.endpoint = params.endpoint;
    this.method = params.method;
    this.responseBody = params.responseBody;
  }
}

function getBackendMessage(responseBody: unknown): string | undefined {
  if (!responseBody || typeof responseBody !== "object") {
    return undefined;
  }

  const message = (responseBody as { message?: unknown }).message;

  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.filter((item) => typeof item === "string").join(" | ");
  }

  return undefined;
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

export async function serviceRequest<TResponse, TBody = unknown>(
  endpoint: string,
  {
    method,
    body,
    headers,
    errorMessage = "Request failed",
  }: ServiceRequestOptions<TBody>,
): Promise<TResponse> {
  const isDev = import.meta.env.DEV;

  if (isDev) {
    console.info("[serviceRequest] Request start", {
      method,
      endpoint,
      hasBody: body !== undefined,
    });
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const rawBody = await response.text();
    const parsedBody = tryParseJson(rawBody);

    if (!response.ok) {
      const backendMessage = getBackendMessage(parsedBody);

      console.error("[serviceRequest] Request failed", {
        method,
        endpoint,
        status: response.status,
        statusText: response.statusText,
        backendMessage,
        responseBody: parsedBody,
      });

      throw new ServiceRequestError({
        message:
          backendMessage ?? `${errorMessage} (status: ${response.status})`,
        status: response.status,
        endpoint,
        method,
        responseBody: parsedBody,
      });
    }

    if (isDev) {
      console.info("[serviceRequest] Request success", {
        method,
        endpoint,
        status: response.status,
      });
    }

    return parsedBody as TResponse;
  } catch (error) {
    console.error("[serviceRequest] Network or unexpected error", {
      method,
      endpoint,
      error,
    });
    throw error;
  }
}
