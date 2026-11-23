import type { NavPremiumSubcategory, NavRegion } from "@/lib/api/types/cms";
import type { PublicTripSearchParams, TripZone } from "@/lib/api/types/trip";
import type { SortOption } from "./SearchSummary";
import { EMPTY_FILTER_CODES, VALID_FILTER_CODES, type FilterCodes } from "./filters";

/** Search criteria carried in the /search URL (shared by the homepage banner, hot keywords and the search page). */
export type SearchUrlState = {
  destination: string;
  keyword: string;
  dateFrom: string;
  dateTo: string;
  zone: TripZone | "";
  themeId: number | null;
  premiumSubcategoryId: number | null;
  /** Side-panel filters (天數／預算／季節), sort and page, so refresh / shared links / back keep them. */
  filters: FilterCodes;
  sort: SortOption;
  page: number;
};

export const DEFAULT_SORT: SortOption = "popular";
const SORTS: SortOption[] = ["popular", "newest", "departure-date", "price-desc", "price-asc"];

export const EMPTY_SEARCH: SearchUrlState = {
  destination: "",
  keyword: "",
  dateFrom: "",
  dateTo: "",
  zone: "",
  themeId: null,
  premiumSubcategoryId: null,
  filters: EMPTY_FILTER_CODES,
  sort: DEFAULT_SORT,
  page: 1,
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
  if (state.premiumSubcategoryId != null) {
    params.set("premium_subcategory_id", String(state.premiumSubcategoryId));
  }
  if (state.filters?.durations.length) params.set("duration", state.filters.durations.join(","));
  if (state.filters?.budgets.length) params.set("budget", state.filters.budgets.join(","));
  if (state.filters?.seasons.length) params.set("season", state.filters.seasons.join(","));
  if (state.sort && state.sort !== DEFAULT_SORT) params.set("sort", state.sort);
  if (state.page && state.page > 1) params.set("page", String(state.page));
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

/** Public theme collection page; the backend names each theme's collection `theme-{themeId}`. */
export function themeCollectionHref(themeId: number): string {
  return `/collections/theme-${themeId}`;
}

export function parseSearchParams(params: URLSearchParams): SearchUrlState {
  const zone = params.get("zone") as TripZone | null;
  const themeId = Number(params.get("theme_id"));
  const premiumSubcategoryId = Number(params.get("premium_subcategory_id"));
  const sort = params.get("sort") as SortOption | null;
  const page = Number(params.get("page"));
  // Unknown codes (typos, old links) are dropped rather than sent to the API.
  const list = (name: string, valid: string[]) =>
    (params.get(name) ?? "").split(",").filter((code) => valid.includes(code));
  return {
    destination: params.get("destination") ?? "",
    keyword: params.get("keyword") ?? "",
    dateFrom: params.get("date_from") ?? "",
    dateTo: params.get("date_to") ?? "",
    zone: zone && ZONES.includes(zone) ? zone : "",
    themeId: Number.isInteger(themeId) && themeId > 0 ? themeId : null,
    premiumSubcategoryId:
      Number.isInteger(premiumSubcategoryId) && premiumSubcategoryId > 0 ? premiumSubcategoryId : null,
    filters: {
      durations: list("duration", VALID_FILTER_CODES.durations),
      budgets: list("budget", VALID_FILTER_CODES.budgets),
      seasons: list("season", VALID_FILTER_CODES.seasons),
    },
    sort: sort && SORTS.includes(sort) ? sort : DEFAULT_SORT,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

/**
 * Turns the free-text fields into API params. The API keyword is a single substring match
 * (multi-word strings match nothing), so a destination that names a region becomes
 * `region_ids`, a keyword that names a 精緻璽品 subcategory becomes `premium_subcategory_ids`
 * (the API keyword doesn't search subcategory names), and only one text value is sent as `keyword`.
 */
export function toApiParams(
  state: SearchUrlState,
  regions: NavRegion[],
  premiumSubcategories: NavPremiumSubcategory[] = []
): PublicTripSearchParams {
  const destination = state.destination.trim();
  const typedKeyword = state.keyword.trim();
  const keywordSubcategory = typedKeyword
    ? premiumSubcategories.find((sub) => sub.name.trim() === typedKeyword)
    : undefined;
  const keyword = keywordSubcategory ? "" : typedKeyword;
  const premiumSubcategoryIds = [
    ...new Set([
      ...(state.premiumSubcategoryId != null ? [state.premiumSubcategoryId] : []),
      ...(keywordSubcategory ? [keywordSubcategory.id] : []),
    ]),
  ];
  // Ignore 「/」 and spaces so 「香港澳門」 still matches the region 「香港/澳門」.
  const normalize = (text: string) => text.replace(/[\s/／]/g, "");
  const target = normalize(destination);
  const region = target
    ? regions.find((r) => {
        const name = normalize(r.name);
        return target.includes(name) || name.includes(target);
      })
    : undefined;

  return {
    keyword: keyword || (region ? "" : destination) || undefined,
    region_ids: region ? [region.id] : [],
    theme_ids: state.themeId != null ? [state.themeId] : [],
    premium_subcategory_ids: premiumSubcategoryIds,
    zone: state.zone || undefined,
    date_from: state.dateFrom || undefined,
    date_to: state.dateTo || undefined,
  };
}
