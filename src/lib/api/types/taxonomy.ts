/** POST/PATCH body for regions, trip-statuses and badges (OpenAPI `NameIn`). */
export type NameIn = {
  name: string;
  position?: number;
};

export type ThemeIn = {
  name: string;
  position?: number;
  visible?: boolean;
};

/** PATCH /admin/taxonomy/nav-categories/{id} (OpenAPI `NavCategoryUpdate`); every field optional. */
export type NavCategoryUpdate = Partial<{
  display_name: string | null;
  submenu_enabled: boolean | null;
  redirect_url: string | null;
}>;

/** Confirmed against GET /admin/taxonomy/{regions,themes,trip-statuses,badges}. */
export type Region = {
  id: number;
  name: string;
  position: number;
  is_active: boolean;
};

export type Theme = {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  collection_id: number;
};

export type TaxonomyOption = {
  id: number;
  name: string;
  position: number;
};

/** Confirmed against GET /admin/taxonomy/nav-categories (rows wrapped in `{ items }`). */
export type NavCategory = {
  id: number;
  key: string;
  display_name: string;
  /** Whether this category can open a submenu at all (國外團體／精緻璽品／主題旅遊). */
  submenu_available: boolean;
  submenu_enabled: boolean;
  redirect_url: string | null;
  position: number;
};
