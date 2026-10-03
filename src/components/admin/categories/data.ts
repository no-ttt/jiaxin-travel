import type { NavCategory, Region, Theme } from "@/lib/api/types/taxonomy";
import { generateId } from "../ui/generateId";

/** API length limits: nav category display_name 1–20, region/theme name 1–30. */
export const CATEGORY_NAME_MAX = 20;
export const SUBCATEGORY_NAME_MAX = 30;

export const isValidName = (name: string, max: number) => {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= max;
};

/** Hint beside the submenu toggle, per category key. */
export const SUBMENU_NOTES: Record<string, { enabled: string; disabled: string }> = {
  overseas_group: {
    enabled: "已啟用，地區子分類請於下方「國外團體地區子分類名稱」區塊編輯。",
    disabled: "如需改用子選單，開啟後地區子分類請於下方「國外團體地區子分類名稱」區塊編輯。",
  },
  premium: {
    enabled: "已啟用，子分類請於下方「精緻璽品子分類名稱」區塊設定。",
    disabled: "如需改用子選單，開啟後內容請於下方「精緻璽品子分類名稱」區塊設定。",
  },
  theme_travel: {
    enabled: "已啟用，子類別請於下方「主題旅遊子類別名稱」區塊編輯。",
    disabled: "如需改用子選單，開啟後子類別請於下方「主題旅遊子類別名稱」區塊編輯。",
  },
};

const GENERIC_SUBMENU_NOTE = {
  enabled: "已啟用子選單。",
  disabled: "子選單關閉時，點擊此分類會導向所設定的頁面網址。",
};

export const submenuNote = (key: string) => SUBMENU_NOTES[key] ?? GENERIC_SUBMENU_NOTE;

export type CategoryDraft = {
  id: number;
  key: string;
  /** From the API (`submenu_available`): only these show the submenu toggle. */
  hasSubmenu: boolean;
  displayName: string;
  submenuEnabled: boolean;
  redirectUrl: string;
};

/** `id` is null for rows added in the editor and not saved yet; `key` is the React key. */
export type RegionDraft = {
  key: string;
  id: number | null;
  name: string;
  position: number;
};

export type ThemeDraft = {
  key: string;
  id: number | null;
  name: string;
  visible: boolean;
  position: number;
  collectionId: number | null;
};

export type CategoriesDraft = {
  categories: CategoryDraft[];
  regions: RegionDraft[];
  themes: ThemeDraft[];
};

export function toCategoriesDraft(
  categories: NavCategory[],
  regions: Region[],
  themes: Theme[],
): CategoriesDraft {
  return {
    categories: categories.map((cat) => ({
      id: cat.id,
      key: cat.key,
      hasSubmenu: cat.submenu_available,
      displayName: cat.display_name,
      submenuEnabled: cat.submenu_enabled,
      redirectUrl: cat.redirect_url ?? "",
    })),
    regions: regions.map((region) => ({
      key: `region-${region.id}`,
      id: region.id,
      name: region.name,
      position: region.position,
    })),
    themes: themes.map((theme) => ({
      key: `theme-${theme.id}`,
      id: theme.id,
      name: theme.name,
      visible: theme.visible,
      position: theme.position,
      collectionId: theme.collection_id,
    })),
  };
}

export const nextPosition = (rows: { position: number }[]) =>
  rows.reduce((max, row) => Math.max(max, row.position), 0) + 1;

export const newRegion = (rows: RegionDraft[]): RegionDraft => ({
  key: generateId("region"),
  id: null,
  name: "",
  position: nextPosition(rows),
});

export const newTheme = (rows: ThemeDraft[]): ThemeDraft => ({
  key: generateId("theme"),
  id: null,
  name: "",
  visible: true,
  position: nextPosition(rows),
  collectionId: null,
});

const normalizeName = (name: string) => name.trim().toLowerCase();

/** Names (normalized) used by more than one row; blank names are left to the required check. */
export function duplicateNames(rows: { name: string }[]): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const row of rows) {
    const name = normalizeName(row.name);
    if (!name) continue;
    if (seen.has(name)) duplicates.add(name);
    seen.add(name);
  }
  return duplicates;
}

export const isDuplicate = (duplicates: Set<string>, name: string) => duplicates.has(normalizeName(name));

export function isDraftValid(draft: CategoriesDraft): boolean {
  return (
    draft.categories.every((cat) => isValidName(cat.displayName, CATEGORY_NAME_MAX)) &&
    draft.regions.every((region) => isValidName(region.name, SUBCATEGORY_NAME_MAX)) &&
    draft.themes.every((theme) => isValidName(theme.name, SUBCATEGORY_NAME_MAX)) &&
    duplicateNames(draft.regions).size === 0 &&
    duplicateNames(draft.themes).size === 0
  );
}

// 精緻璽品子分類：後端尚無對應 API，暫以本地假資料呈現，不會儲存。
export type LuxurySubcategory = {
  id: string;
  name: string;
  visible: boolean;
};

export const INITIAL_LUXURY_SUBCATEGORIES: LuxurySubcategory[] = [];
