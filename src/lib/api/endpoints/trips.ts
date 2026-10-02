import { apiFetch } from "../client";
import type { Paginated } from "../types/common";
import type {
  BatchAction,
  DayIn,
  FeatureCardIn,
  FlightsPayload,
  NoticeTabIn,
  TripCreate,
  TripCreateResponse,
  TripDetail,
  TripListItem,
  PublicTripCard,
  PublicTripDetail,
  PublicTripSearchParams,
  TripListFilters,
  TripUpdate,
} from "../types/trip";

function buildQuery(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const tripsApi = {
  // admin:trips
  list: (filters: TripListFilters = {}) =>
    apiFetch<Paginated<TripListItem>>(`/admin/trips${buildQuery(filters)}`),

  get: (tripId: string) => apiFetch<TripDetail>(`/admin/trips/${tripId}`),

  create: (payload: TripCreate) =>
    apiFetch<TripCreateResponse>("/admin/trips", { method: "POST", body: payload }),

  update: (tripId: string, payload: TripUpdate) =>
    apiFetch<unknown>(`/admin/trips/${tripId}`, { method: "PATCH", body: payload }),

  remove: (tripId: string) => apiFetch<void>(`/admin/trips/${tripId}`, { method: "DELETE" }),

  batch: (payload: BatchAction) =>
    apiFetch<void>("/admin/trips/batch", { method: "POST", body: payload }),

  duplicate: (tripId: string) =>
    apiFetch<TripCreateResponse>(`/admin/trips/${tripId}/duplicate`, { method: "POST" }),

  // feature-cards / days / notice-tabs take a bare JSON array as the body (not wrapped in an object).
  putFeatureCards: (tripId: string, cards: FeatureCardIn[]) =>
    apiFetch<{ count: number }>(`/admin/trips/${tripId}/feature-cards`, { method: "PUT", body: cards }),

  putFlights: (tripId: string, payload: FlightsPayload) =>
    apiFetch<{ count: number }>(`/admin/trips/${tripId}/flights`, { method: "PUT", body: payload }),

  putDays: (tripId: string, days: DayIn[]) =>
    apiFetch<{ count: number; warning: string | null }>(`/admin/trips/${tripId}/days`, {
      method: "PUT",
      body: days,
    }),

  putNoticeTabs: (tripId: string, tabs: NoticeTabIn[]) =>
    apiFetch<{ count: number }>(`/admin/trips/${tripId}/notice-tabs`, { method: "PUT", body: tabs }),

  // public:trips
  publicCodes: () => apiFetch<string[]>("/public/trips/codes", { auth: false }),

  publicSearch: (params: PublicTripSearchParams = {}) =>
    apiFetch<Paginated<PublicTripCard>>(`/public/trips/search${buildQuery(params)}`, { auth: false }),

  publicDetail: (tripCode: string) =>
    apiFetch<PublicTripDetail>(`/public/trips/${encodeURIComponent(tripCode)}`, { auth: false }),
};
