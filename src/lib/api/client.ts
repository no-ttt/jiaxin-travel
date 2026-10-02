import { API_BASE_URL, API_V1_PREFIX } from "./config";
import { getAccessToken, setAccessToken } from "./token-store";
import type { HTTPValidationError } from "./types/common";
import type { LoginOut } from "./types/auth";

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
  /** Set false to call an endpoint outside /api/v1 (e.g. /sitemap.xml). */
  versioned?: boolean;
};

let refreshPromise: Promise<LoginOut | null> | null = null;

/**
 * Exchanges the refresh cookie for a new access token. Concurrent callers share one
 * request: the backend rotates the refresh token on every use, so a second parallel
 * call (e.g. React Strict Mode running effects twice) would send a stale token and 401.
 */
export function refreshSession(): Promise<LoginOut | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}${API_V1_PREFIX}/admin/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as LoginOut;
        setAccessToken(data.access_token);
        return data;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/** Notified when an authenticated request fails because the session can no longer be refreshed. */
type SessionExpiredListener = () => void;
const sessionExpiredListeners = new Set<SessionExpiredListener>();

export function onSessionExpired(listener: SessionExpiredListener): () => void {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
}

async function refreshAccessToken(): Promise<string | null> {
  return (await refreshSession())?.access_token ?? null;
}

async function parseErrorBody(res: Response): Promise<unknown> {
  try {
    return (await res.json()) as HTTPValidationError | { detail?: string };
  } catch {
    return undefined;
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, versioned = true, headers, ...rest } = options;

  const buildHeaders = (): HeadersInit => {
    const h = new Headers(headers);
    if (body !== undefined) h.set("Content-Type", "application/json");
    if (auth) {
      const token = getAccessToken();
      if (token) h.set("Authorization", `Bearer ${token}`);
    }
    return h;
  };

  const url = `${API_BASE_URL}${versioned ? API_V1_PREFIX : ""}${path}`;

  const doFetch = () =>
    fetch(url, {
      ...rest,
      credentials: "include",
      headers: buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await doFetch();

  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch();
    } else {
      // Access token expired and the refresh cookie is gone/expired: the login has ended.
      sessionExpiredListeners.forEach((listener) => listener());
    }
  }

  if (!res.ok) {
    const detail = await parseErrorBody(res);
    throw new ApiError(res.status, `API request failed: ${res.status} ${path}`, detail);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return (await res.text()) as unknown as T;
  }

  return (await res.json()) as T;
}
