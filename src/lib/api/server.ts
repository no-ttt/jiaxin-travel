import "server-only";

import { ApiError } from "./client";
import { API_V1_PREFIX, SERVER_API_ORIGIN } from "./config";
import type { Footer, Homepage, Navigation } from "./types/cms";
import type { PublicCollection } from "./types/collection";
import type { PublicTripDetail } from "./types/trip";

/**
 * 後端 API 存取（伺服器端專用：Server Component / Route Handler）。
 *
 * fetch 帶 tags ['cms', ...]，由 Next 快取（ISR）。後台儲存後後端會呼叫 /api/revalidate
 * 讓 'cms' 過期，下一個請求就拿到最新內容。本機開發（npm run dev）不快取，一般重新整理即為最新。
 *
 * 瀏覽器端請繼續用 ./client 的 apiFetch（同源 /api/v1）。
 */
export const CMS_TAG = "cms";

/** Hard ceiling for cached data in case a revalidate call from the backend is missed. */
const DEFAULT_REVALIDATE_SECONDS = 3600;

async function serverFetch(path: string, init: RequestInit = {}): Promise<Response> {
  // Bounded so an unreachable API (e.g. during `next build`) fails fast instead of hanging the render.
  return fetch(`${SERVER_API_ORIGIN}${API_V1_PREFIX}${path}`, { signal: AbortSignal.timeout(10_000), ...init });
}

async function cmsFetch<T>(path: string, opts: { tags?: string[] } = {}): Promise<T> {
  const headers = { accept: "application/json" };
  // Local dev: nobody calls /api/revalidate on localhost (the backend only notifies the deployed
  // frontend), so skip the data cache and show admin edits on a normal reload.
  const init: RequestInit =
    process.env.NODE_ENV === "development"
      ? { headers, cache: "no-store" }
      : {
          headers,
          next: { tags: [CMS_TAG, ...(opts.tags ?? [])], revalidate: DEFAULT_REVALIDATE_SECONDS },
        };
  const res = await serverFetch(path, init);
  if (!res.ok) {
    throw new ApiError(res.status, `API request failed: ${res.status} ${path}`);
  }
  return (await res.json()) as T;
}

export const getNavigation = () => cmsFetch<Navigation>("/public/navigation", { tags: ["navigation"] });
export const getFooter = () => cmsFetch<Footer>("/public/footer", { tags: ["footer"] });
export const getHomepage = () => cmsFetch<Homepage>("/public/homepage", { tags: ["homepage"] });

export const getPublicTrip = (tripCode: string) =>
  cmsFetch<PublicTripDetail>(`/public/trips/${encodeURIComponent(tripCode)}`, {
    tags: ["trips", `trip:${tripCode}`],
  });

/** First page of a collection (e.g. slug "theme-1"); later pages load in the browser. */
export const getPublicCollection = (slug: string) =>
  cmsFetch<PublicCollection>(`/public/collections/${encodeURIComponent(slug)}`, {
    tags: ["collections", `collection:${slug}`],
  });
