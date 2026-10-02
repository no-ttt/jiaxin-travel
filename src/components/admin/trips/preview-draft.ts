import type { TripContent } from "./content";
import type { TripForm } from "./form";

/**
 * Hands the editor's unsaved draft to the preview tab (/admin/trip-preview/[id]) through
 * localStorage: every same-origin tab shares it, and writing it fires a `storage` event in the
 * other tabs, so an open preview re-renders as the admin types. Nothing is sent to the API.
 */
export type PreviewDraft = { tripCode: string; form: TripForm; content: TripContent };

export const previewDraftKey = (tripId: string) => `trip-preview:${tripId}`;

export function writePreviewDraft(tripId: string, draft: PreviewDraft): void {
  try {
    localStorage.setItem(previewDraftKey(tripId), JSON.stringify(draft));
  } catch {
    // Storage blocked or full: the preview tab shows its "open from the editor" message.
  }
}

/** Raw stored JSON (a string, so useSyncExternalStore can compare snapshots), or null. */
export function readPreviewDraftRaw(tripId: string): string | null {
  try {
    return localStorage.getItem(previewDraftKey(tripId));
  } catch {
    return null;
  }
}

export function parsePreviewDraft(raw: string | null): PreviewDraft | null {
  try {
    return raw ? (JSON.parse(raw) as PreviewDraft) : null;
  } catch {
    return null;
  }
}

/** useSyncExternalStore subscriber: fires when another tab rewrites the draft. */
export function subscribePreviewDraft(tripId: string, onChange: () => void): () => void {
  const key = previewDraftKey(tripId);
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
