export type ThemeIn = {
  name: string;
};

export type NavCategoryUpdate = Partial<{
  label: string | null;
  visible: boolean | null;
  position: number | null;
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

export type NavCategory = {
  id: number;
  label: string;
  visible: boolean;
  position: number;
};
