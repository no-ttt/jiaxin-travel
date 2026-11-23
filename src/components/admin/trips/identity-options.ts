import { taxonomyApi } from "@/lib/api/endpoints/taxonomy";
import type { TaxonomyOption } from "@/lib/api/types/taxonomy";

/** 行程狀態／卡片標章 option lists as edited in 識別內容設定; new (unsaved) items have negative ids. */
export type IdentityOption = { id: number; name: string };
export type IdentityOptions = { statuses: IdentityOption[]; badges: IdentityOption[] };

export const toIdentityOptions = (
  statuses: TaxonomyOption[],
  badges: TaxonomyOption[]
): IdentityOptions => ({
  statuses: statuses.map(({ id, name }) => ({ id, name })),
  badges: badges.map(({ id, name }) => ({ id, name })),
});

export const sameIdentityOptions = (a: IdentityOptions, b: IdentityOptions) =>
  JSON.stringify(a) === JSON.stringify(b);

let tempId = 0;
/** Id for an option that only exists in the draft until 儲存變更. */
export const newOptionId = () => --tempId;

type Kind = "statuses" | "badges";
const api = {
  statuses: { create: taxonomyApi.createTripStatus, remove: taxonomyApi.deleteTripStatus },
  badges: { create: taxonomyApi.createBadge, remove: taxonomyApi.deleteBadge },
};

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
 */
export async function saveIdentityOptions(
  base: IdentityOptions,
  draft: IdentityOptions
): Promise<IdentityOptionsSaveResult> {
  const saved: IdentityOptions = { statuses: [...base.statuses], badges: [...base.badges] };
  const createdIds = new Map<number, number>();
  try {
    for (const kind of ["statuses", "badges"] as Kind[]) {
      const keep = new Set(draft[kind].map((option) => option.id));
      for (const option of base[kind].filter((o) => !keep.has(o.id))) {
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
