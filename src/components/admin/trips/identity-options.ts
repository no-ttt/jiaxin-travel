import { taxonomyApi } from "@/lib/api/endpoints/taxonomy";
import type { TaxonomyOption, Theme } from "@/lib/api/types/taxonomy";

/** 主題標籤／行程狀態／卡片標章 lists as edited in 識別內容設定; new (unsaved) items have negative ids. */
export type IdentityOption = { id: number; name: string };
export type IdentityOptions = { themes: IdentityOption[]; statuses: IdentityOption[]; badges: IdentityOption[] };

const pick = (items: { id: number; name: string }[]) => items.map(({ id, name }) => ({ id, name }));

export const toIdentityOptions = (
  themes: Theme[],
  statuses: TaxonomyOption[],
  badges: TaxonomyOption[]
): IdentityOptions => ({ themes: pick(themes), statuses: pick(statuses), badges: pick(badges) });

export const sameIdentityOptions = (a: IdentityOptions, b: IdentityOptions) =>
  JSON.stringify(a) === JSON.stringify(b);

let tempId = 0;
/** Id for an option that only exists in the draft until 儲存變更. */
export const newOptionId = () => --tempId;

export type IdentityKind = keyof IdentityOptions;
const KINDS: IdentityKind[] = ["themes", "statuses", "badges"];
const api: Record<
  IdentityKind,
  { create: (payload: { name: string; position: number }) => Promise<{ id: number }>; remove: (id: number) => Promise<void> }
> = {
  themes: { create: taxonomyApi.createTheme, remove: taxonomyApi.deleteTheme },
  statuses: { create: taxonomyApi.createTripStatus, remove: taxonomyApi.deleteTripStatus },
  badges: { create: taxonomyApi.createBadge, remove: taxonomyApi.deleteBadge },
};

/** Themes in `base` that the draft removed (deleted only after the trip itself is saved). */
export const hasThemeRemovals = (base: IdentityOptions, draft: IdentityOptions) =>
  base.themes.some((theme) => !draft.themes.some((t) => t.id === theme.id));

export type IdentityOptionsSaveResult = {
  /** The lists as now stored (real ids), in display order. */
  saved: IdentityOptions;
  /** Draft (negative) id → created id, for remapping the trip's status_id / badge_id. */
  createdIds: Map<number, number>;
  error: unknown;
};

/**
 * Applies the draft lists: deletes removed options, then creates the new ones (appended in draft
 * order). Stops at the first failure and reports what was saved up to that point.
 *
 * `keepThemes`: skip deleting themes for now. The backend refuses (409) to delete a theme any trip
 * still uses, so a theme this trip drops is deleted in a second call after the trip is saved.
 */
export async function saveIdentityOptions(
  base: IdentityOptions,
  draft: IdentityOptions,
  { keepThemes = false }: { keepThemes?: boolean } = {}
): Promise<IdentityOptionsSaveResult> {
  const saved: IdentityOptions = { themes: [...base.themes], statuses: [...base.statuses], badges: [...base.badges] };
  const createdIds = new Map<number, number>();
  try {
    for (const kind of KINDS) {
      const keep = new Set(draft[kind].map((option) => option.id));
      const removed = kind === "themes" && keepThemes ? [] : base[kind].filter((o) => !keep.has(o.id));
      for (const option of removed) {
        await api[kind].remove(option.id);
        saved[kind] = saved[kind].filter((o) => o.id !== option.id);
      }
      for (const [index, option] of draft[kind].entries()) {
        if (option.id >= 0) continue;
        const created = await api[kind].create({ name: option.name, position: index });
        createdIds.set(option.id, created.id);
        saved[kind] = [...saved[kind], { id: created.id, name: option.name }];
      }
    }
    return { saved, createdIds, error: null };
  } catch (error) {
    return { saved, createdIds, error };
  }
}
