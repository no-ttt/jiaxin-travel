import type { NavRegion } from "@/lib/api/types/cms";
import type { PublicTripSearchParams, TripZone } from "@/lib/api/types/trip";

/** Search criteria carried in the /search URL (shared by the homepage banner, hot keywords and the search page). */
export type SearchUrlState = {
  destination: string;
  keyword: string;
  dateFrom: string;
  dateTo: string;
  zone: TripZone | "";
  themeId: number | null;
};

export const EMPTY_SEARCH: SearchUrlState = {
  destination: "",
  keyword: "",
  dateFrom: "",
  dateTo: "",
  zone: "",
  themeId: null,
};

const ZONES: TripZone[] = ["overseas_group", "theme_travel", "premium", "meian"];

export function buildSearchHref(state: Partial<SearchUrlState>): string {
  const params = new URLSearchParams();
  if (state.destination?.trim()) params.set("destination", state.destination.trim());
  if (state.keyword?.trim()) params.set("keyword", state.keyword.trim());
  if (state.dateFrom) params.set("date_from", state.dateFrom);
  if (state.dateTo) params.set("date_to", state.dateTo);
  if (state.zone) params.set("zone", state.zone);
  if (state.themeId != null) params.set("theme_id", String(state.themeId));
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

/** Public theme collection page; the backend names each theme's collection `theme-{themeId}`. */
export function themeCollectionHref(themeId: number): string {
  return `/theme/theme-${themeId}`;
}

export function parseSearchParams(params: URLSearchParams): SearchUrlState {
  const zone = params.get("zone") as TripZone | null;
  const themeId = Number(params.get("theme_id"));
  return {
    destination: params.get("destination") ?? "",
    keyword: params.get("keyword") ?? "",
    dateFrom: params.get("date_from") ?? "",
    dateTo: params.get("date_to") ?? "",
    zone: zone && ZONES.includes(zone) ? zone : "",
    themeId: Number.isInteger(themeId) && themeId > 0 ? themeId : null,
  };
}

/**
 * Turns the free-text fields into API params. The API keyword is a single substring match
 * (multi-word strings match nothing), so a destination that names a region becomes
 * `region_ids`, and only one text value is sent as `keyword`.
 */
export function toApiParams(state: SearchUrlState, regions: NavRegion[]): PublicTripSearchParams {
  const destination = state.destination.trim();
  const keyword = state.keyword.trim();
  const region = destination
    ? regions.find((r) => destination.includes(r.name) || r.name.includes(destination))
    : undefined;

  return {
    keyword: keyword || (region ? "" : destination) || undefined,
    region_ids: region ? [region.id] : [],
    theme_ids: state.themeId != null ? [state.themeId] : [],
    zone: state.zone || undefined,
    date_from: state.dateFrom || undefined,
    date_to: state.dateTo || undefined,
  };
}
