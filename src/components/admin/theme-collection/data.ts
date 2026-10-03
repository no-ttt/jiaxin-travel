import type { Collection, CollectionTrip, CollectionUpdate } from "@/lib/api/types/collection";

export const THEME_COLOR_PRESETS = ["#14111A", "#0A1F3A", "#0B251B", "#370B16", "#1B1B1F"];
export const BUTTON_COLOR_PRESETS = ["#FF5C00", "#0053E0", "#0B9980", "#C99D28", "#BA1B6A"];

/** What the public theme page falls back to when a color is left blank (see components/theme-collection). */
export const DEFAULT_THEME_COLOR = "#14111A";
export const DEFAULT_BUTTON_COLOR = "#FF5C00";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
/** Blank means "use the default"; anything else must be #RRGGBB (API validation rule). */
export const isValidColor = (value: string) => value.trim() === "" || HEX_COLOR.test(value.trim());

export type ThemeCollectionDraft = {
  title: string;
  subtitle: string;
  tagText: string;
  themeColor: string;
  buttonColor: string;
  heroMediaId: string | null;
  trips: CollectionTrip[];
};

export function toThemeCollectionDraft(collection: Collection): ThemeCollectionDraft {
  return {
    title: collection.title,
    subtitle: collection.subtitle,
    tagText: collection.tag_text,
    themeColor: collection.theme_color ?? "",
    buttonColor: collection.button_color ?? "",
    heroMediaId: collection.hero_media_id,
    trips: collection.trips,
  };
}

/** Compares trimmed on both sides, so server values with stray spaces don't read as edited. */
const changed = (draftValue: string, baseValue: string) => draftValue.trim() !== baseValue.trim();

/** PATCH body with only the changed fields, or null when nothing changed. */
export function collectionPatch(base: ThemeCollectionDraft, draft: ThemeCollectionDraft): CollectionUpdate | null {
  const patch: CollectionUpdate = {};
  if (changed(draft.title, base.title)) patch.title = draft.title.trim();
  if (changed(draft.subtitle, base.subtitle)) patch.subtitle = draft.subtitle.trim();
  if (changed(draft.tagText, base.tagText)) patch.tag_text = draft.tagText.trim();
  if (changed(draft.themeColor, base.themeColor)) patch.theme_color = draft.themeColor.trim() || null;
  if (changed(draft.buttonColor, base.buttonColor)) patch.button_color = draft.buttonColor.trim() || null;
  if (draft.heroMediaId !== base.heroMediaId) patch.hero_media_id = draft.heroMediaId;
  return Object.keys(patch).length > 0 ? patch : null;
}

export const tripIds = (trips: CollectionTrip[]) => trips.map((trip) => trip.id);

export const sameOrder = (a: string[], b: string[]) => a.length === b.length && a.every((id, i) => id === b[i]);
