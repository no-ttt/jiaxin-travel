import { apiFetch } from "../client";
import type { ItemsResponse } from "../types/common";
import type {
  NavCategory,
  NavCategoryUpdate,
  Region,
  TaxonomyOption,
  Theme,
  ThemeIn,
} from "../types/taxonomy";

export const taxonomyApi = {
  listNavCategories: () => apiFetch<NavCategory[]>("/admin/taxonomy/nav-categories"),

  updateNavCategory: (catId: number, payload: NavCategoryUpdate) =>
    apiFetch<NavCategory>(`/admin/taxonomy/nav-categories/${catId}`, {
      method: "PATCH",
      body: payload,
    }),

  listRegions: () =>
    apiFetch<ItemsResponse<Region>>("/admin/taxonomy/regions").then((res) => res.items),
  createRegion: (payload: { name: string }) =>
    apiFetch<Region>("/admin/taxonomy/regions", { method: "POST", body: payload }),
  updateRegion: (regionId: number, payload: { name: string }) =>
    apiFetch<Region>(`/admin/taxonomy/regions/${regionId}`, { method: "PATCH", body: payload }),
  deleteRegion: (regionId: number) =>
    apiFetch<void>(`/admin/taxonomy/regions/${regionId}`, { method: "DELETE" }),

  listThemes: () =>
    apiFetch<ItemsResponse<Theme>>("/admin/taxonomy/themes").then((res) => res.items),
  createTheme: (payload: ThemeIn) =>
    apiFetch<Theme>("/admin/taxonomy/themes", { method: "POST", body: payload }),
  updateTheme: (themeId: number, payload: ThemeIn) =>
    apiFetch<Theme>(`/admin/taxonomy/themes/${themeId}`, { method: "PATCH", body: payload }),
  deleteTheme: (themeId: number) =>
    apiFetch<void>(`/admin/taxonomy/themes/${themeId}`, { method: "DELETE" }),

  listTripStatuses: () =>
    apiFetch<ItemsResponse<TaxonomyOption>>("/admin/taxonomy/trip-statuses").then((res) => res.items),
  createTripStatus: (payload: { label: string }) =>
    apiFetch<TaxonomyOption>("/admin/taxonomy/trip-statuses", { method: "POST", body: payload }),
  deleteTripStatus: (optionId: number) =>
    apiFetch<void>(`/admin/taxonomy/trip-statuses/${optionId}`, { method: "DELETE" }),

  listBadges: () =>
    apiFetch<ItemsResponse<TaxonomyOption>>("/admin/taxonomy/badges").then((res) => res.items),
  createBadge: (payload: { label: string }) =>
    apiFetch<TaxonomyOption>("/admin/taxonomy/badges", { method: "POST", body: payload }),
  deleteBadge: (optionId: number) =>
    apiFetch<void>(`/admin/taxonomy/badges/${optionId}`, { method: "DELETE" }),
};
