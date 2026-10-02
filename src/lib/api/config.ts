const trimSlash = (url: string) => url.replace(/\/+$/, "");

/** Public backend origin (no trailing slash). Same fallback chain as next.config.ts. */
export const PUBLIC_API_ORIGIN = trimSlash(
  process.env.NEXT_PUBLIC_API_BASE ?? process.env.NEXT_PUBLIC_API_URL ?? "https://www.chtravels.com"
);

/** Server-side origin: the Docker-internal address when set, else the public one. */
export const SERVER_API_ORIGIN = trimSlash(process.env.API_INTERNAL_BASE ?? "") || PUBLIC_API_ORIGIN;

// In the browser, call same-origin paths; /api/v1/* is routed to the backend (Caddy in
// production, next.config.ts rewrites in dev). This avoids CORS and keeps the refresh-token
// cookie first-party.
export const API_BASE_URL = typeof window === "undefined" ? SERVER_API_ORIGIN : "";

export const API_V1_PREFIX = "/api/v1";
