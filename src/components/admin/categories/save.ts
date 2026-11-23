import { taxonomyApi } from "@/lib/api/endpoints/taxonomy";
import type { NavCategoryUpdate } from "@/lib/api/types/taxonomy";
import type { CategoriesDraft, CategoryDraft } from "./data";

/**
 * One API request produced by diffing the draft against the last server copy. After a save the
 * page reloads and shows the server copy, so nothing is reapplied. A region / 精緻璽品子分類 removal
 * carries its kind, id and label: the API may refuse it (still tagged on trips), shown in the
 * "無法刪除" dialog. A create/rename carries `named`: the API refuses a name another row already has
 * (409), shown in the "名稱已存在" dialog.
 */
export type SaveOp = {
  run: () => Promise<unknown>;
  removed?: { kind: "region" | "premium"; id: number; label: string };
  named?: { label: string };
};

const nullIfBlank = (value: string) => value.trim() || null;

/** Compares trimmed on both sides, so server values with stray spaces don't read as edited. */
const changed = (draftValue: string, baseValue: string) => draftValue.trim() !== baseValue.trim();

function categoryPatch(base: CategoryDraft, draft: CategoryDraft): NavCategoryUpdate | null {
  const patch: NavCategoryUpdate = {};
  if (changed(draft.displayName, base.displayName)) patch.display_name = draft.displayName.trim();
  if (draft.submenuEnabled !== base.submenuEnabled) patch.submenu_enabled = draft.submenuEnabled;
  if (nullIfBlank(draft.redirectUrl) !== nullIfBlank(base.redirectUrl)) {
    patch.redirect_url = nullIfBlank(draft.redirectUrl);
  }
  return Object.keys(patch).length > 0 ? patch : null;
}

export function buildSaveOps(base: CategoriesDraft, draft: CategoriesDraft): SaveOp[] {
  const ops: SaveOp[] = [];

  for (const cat of draft.categories) {
    const original = base.categories.find((c) => c.id === cat.id);
    const patch = original && categoryPatch(original, cat);
    if (patch) ops.push({ run: () => taxonomyApi.updateNavCategory(cat.id, patch) });
  }

  // NameIn / ThemeIn default omitted fields (position → 0, visible → true), so PATCH sends the whole row.
  for (const region of draft.regions) {
    const name = region.name.trim();
    if (region.id == null) {
      ops.push({
        run: () => taxonomyApi.createRegion({ name, position: region.position }),
        named: { label: `地區「${name}」` },
      });
      continue;
    }
    const id = region.id;
    const original = base.regions.find((r) => r.id === id);
    if (original && changed(region.name, original.name)) {
      ops.push({
        run: () => taxonomyApi.updateRegion(id, { name, position: region.position }),
        named: { label: `地區「${original.name}」改名為「${name}」` },
      });
    }
  }
  for (const original of base.regions) {
    const id = original.id;
    if (id != null && !draft.regions.some((r) => r.id === id)) {
      ops.push({
        run: () => taxonomyApi.deleteRegion(id),
        removed: { kind: "region", id, label: `地區「${original.name}」` },
      });
    }
  }

  for (const sub of draft.premiumSubcategories) {
    const payload = { name: sub.name.trim(), position: sub.position, visible: sub.visible };
    if (sub.id == null) {
      ops.push({
        run: () => taxonomyApi.createPremiumSubcategory(payload),
        named: { label: `精緻璽品子分類「${payload.name}」` },
      });
      continue;
    }
    const id = sub.id;
    const original = base.premiumSubcategories.find((s) => s.id === id);
    if (original && (changed(sub.name, original.name) || original.visible !== sub.visible)) {
      ops.push({
        run: () => taxonomyApi.updatePremiumSubcategory(id, payload),
        named: { label: `精緻璽品子分類「${original.name}」` },
      });
    }
  }
  for (const original of base.premiumSubcategories) {
    const id = original.id;
    if (id != null && !draft.premiumSubcategories.some((s) => s.id === id)) {
      ops.push({
        run: () => taxonomyApi.deletePremiumSubcategory(id),
        removed: { kind: "premium", id, label: `精緻璽品子分類「${original.name}」` },
      });
    }
  }

  for (const theme of draft.themes) {
    const payload = { name: theme.name.trim(), position: theme.position, visible: theme.visible };
    if (theme.id == null) {
      ops.push({ run: () => taxonomyApi.createTheme(payload) });
      continue;
    }
    const id = theme.id;
    const original = base.themes.find((t) => t.id === id);
    if (original && (changed(theme.name, original.name) || original.visible !== theme.visible)) {
      ops.push({ run: () => taxonomyApi.updateTheme(id, payload) });
    }
  }

  return ops;
}

/** Runs every op concurrently; returns each failed op with its error. */
export async function runSaveOps(ops: SaveOp[]): Promise<{ op: SaveOp; error: unknown }[]> {
  const results = await Promise.allSettled(ops.map((op) => op.run()));
  return results.flatMap((result, i) => (result.status === "rejected" ? [{ op: ops[i], error: result.reason }] : []));
}
