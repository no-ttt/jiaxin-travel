import "server-only";

import { cache } from "react";

import { ApiError } from "./client";
import { API_V1_PREFIX, SERVER_API_ORIGIN } from "./config";
import type {
  ContractPage,
  Footer,
  FraudNoticePage,
  Homepage,
  Navigation,
  PolicyPage,
  PurchaseFlowPage,
  VisaServices,
} from "./types/cms";
import type { PublicCollection } from "./types/collection";
import type { PublicJourneyList } from "./types/journey";
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

/**
 * One backend call per path per server request. The timeout `signal` opts fetch out of Next's
 * automatic memoization, so without this the root layout and a page asking for the same document
 * (e.g. 訂購流程 for the footer and for /pages/purchase-flow) each hit the API.
 * Keyed by primitives (path + comma-joined tags) because React.cache compares arguments by identity.
 */
const cmsFetchOnce = cache(async (path: string, tagList: string): Promise<unknown> => {
  const headers = { accept: "application/json" };
  const tags = tagList ? tagList.split(",") : [];
  // Local dev: nobody calls /api/revalidate on localhost (the backend only notifies the deployed
  // frontend), so skip the data cache and show admin edits on a normal reload.
  const init: RequestInit =
    process.env.NODE_ENV === "development"
      ? { headers, cache: "no-store" }
      : {
          headers,
          next: { tags: [CMS_TAG, ...tags], revalidate: DEFAULT_REVALIDATE_SECONDS },
        };
  const res = await serverFetch(path, init);
  if (!res.ok) {
    throw new ApiError(res.status, `API request failed: ${res.status} ${path}`);
  }
  return res.json();
});

const cmsFetch = <T>(path: string, opts: { tags?: string[] } = {}): Promise<T> =>
  cmsFetchOnce(path, (opts.tags ?? []).join(",")) as Promise<T>;

export const getNavigation = () => cmsFetch<Navigation>("/public/navigation", { tags: ["navigation"] });
export const getFooter = () => cmsFetch<Footer>("/public/footer", { tags: ["footer"] });
export const getHomepage = () => cmsFetch<Homepage>("/public/homepage", { tags: ["homepage"] });
export const getVisaServices = () =>
  cmsFetch<VisaServices>("/public/visa-services", { tags: ["visa-services"] });

/** 旅客須知 tab content (key e.g. "fraud-notice"). */
const getContentPage = <T>(key: string) =>
  cmsFetch<T>(`/public/pages/${encodeURIComponent(key)}`, { tags: ["pages", `page:${key}`] });
export const getFraudNotice = () => getContentPage<FraudNoticePage>("fraud-notice");
export const getContract = () => getContentPage<ContractPage>("contract");
export const getPurchaseFlow = () => getContentPage<PurchaseFlowPage>("purchase-flow");
export const getCancellationPolicy = () => getContentPage<PolicyPage>("cancellation-policy");
export const getAnnouncements = () => getContentPage<PolicyPage>("announcements");

export const getPublicTrip = (tripCode: string) =>
  cmsFetch<PublicTripDetail>(`/public/trips/${encodeURIComponent(tripCode)}`, {
    tags: ["trips", `trip:${tripCode}`],
  });

export const getPublicJourneys = () =>
  cmsFetch<PublicJourneyList>("/public/journeys", { tags: ["journeys"] });

/** First page of a collection (e.g. slug "theme-1"); later pages load in the browser. */
export const getPublicCollection = (slug: string) =>
  cmsFetch<PublicCollection>(`/public/collections/${encodeURIComponent(slug)}`, {
    tags: ["collections", `collection:${slug}`],
  });
