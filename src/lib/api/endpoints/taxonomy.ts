import { apiFetch } from "../client";
import { toItems, type ItemsResponse } from "../types/common";
import type {
  NameIn,
  NavCategory,
  NavCategoryUpdate,
  Region,
  TaxonomyOption,
  Theme,
  ThemeIn,
} from "../types/taxonomy";

export const taxonomyApi = {
  listNavCategories: () =>
    apiFetch<NavCategory[] | ItemsResponse<NavCategory>>("/admin/taxonomy/nav-categories").then(toItems),

  updateNavCategory: (catId: number, payload: NavCategoryUpdate) =>
    apiFetch<NavCategory>(`/admin/taxonomy/nav-categories/${catId}`, {
      method: "PATCH",
      body: payload,
    }),

  listRegions: () =>
    apiFetch<Region[] | ItemsResponse<Region>>("/admin/taxonomy/regions").then(toItems),
  createRegion: (payload: NameIn) =>
    apiFetch<Region>("/admin/taxonomy/regions", { method: "POST", body: payload }),
  updateRegion: (regionId: number, payload: NameIn) =>
    apiFetch<Region>(`/admin/taxonomy/regions/${regionId}`, { method: "PATCH", body: payload }),
  deleteRegion: (regionId: number) =>
    apiFetch<void>(`/admin/taxonomy/regions/${regionId}`, { method: "DELETE" }),

  listThemes: () =>
    apiFetch<Theme[] | ItemsResponse<Theme>>("/admin/taxonomy/themes").then(toItems),
  createTheme: (payload: ThemeIn) =>
    apiFetch<Theme>("/admin/taxonomy/themes", { method: "POST", body: payload }),
  /** The body schema is ThemeIn (name required), so callers send the full row, not a diff. */
  updateTheme: (themeId: number, payload: ThemeIn) =>
    apiFetch<Theme>(`/admin/taxonomy/themes/${themeId}`, { method: "PATCH", body: payload }),
  deleteTheme: (themeId: number) =>
    apiFetch<void>(`/admin/taxonomy/themes/${themeId}`, { method: "DELETE" }),

  listTripStatuses: () =>
    apiFetch<ItemsResponse<TaxonomyOption>>("/admin/taxonomy/trip-statuses").then(toItems),
  createTripStatus: (payload: NameIn) =>
    apiFetch<TaxonomyOption>("/admin/taxonomy/trip-statuses", { method: "POST", body: payload }),
  deleteTripStatus: (optionId: number) =>
    apiFetch<void>(`/admin/taxonomy/trip-statuses/${optionId}`, { method: "DELETE" }),

  listBadges: () =>
    apiFetch<ItemsResponse<TaxonomyOption>>("/admin/taxonomy/badges").then(toItems),
  createBadge: (payload: NameIn) =>
    apiFetch<TaxonomyOption>("/admin/taxonomy/badges", { method: "POST", body: payload }),
  deleteBadge: (optionId: number) =>
    apiFetch<void>(`/admin/taxonomy/badges/${optionId}`, { method: "DELETE" }),
};
