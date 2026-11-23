"use client";

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";

/**
 * 後台「預覽」for the CMS pages: the editor hands its unsaved draft to the preview tab
 * (/admin/preview/{key}) through localStorage. Every same-origin tab shares it and writing it fires
 * a `storage` event in the other tabs, so an open preview re-renders as the admin types.
 * Nothing is sent to the API. (Trips use their own store: /admin/trip-preview/[id].)
 */
export const PREVIEW_KEYS = [
  "homepage",
  "categories",
  "footer",
  "visa-services",
  "journeys",
  "purchase-flow",
  "cancellation-policy",
  "contract",
  "fraud-notice",
  "announcements",
] as const;
export type PreviewKey = (typeof PREVIEW_KEYS)[number];

export const isPreviewKey = (key: string): key is PreviewKey => (PREVIEW_KEYS as readonly string[]).includes(key);

const storageKey = (key: PreviewKey) => `admin-preview:${key}`;

function writeDraft(key: PreviewKey, data: unknown): void {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(data));
  } catch {
    // Storage blocked or full: the preview tab shows its "open from the editor" message.
  }
}

function readDraftRaw(key: PreviewKey): string | null {
  try {
    return localStorage.getItem(storageKey(key));
  } catch {
    return null;
  }
}

/**
 * Editor side: keeps the stored draft in step with `draft` (converted by `toDoc`) and returns
 * the 預覽 button handler. `toDoc` may change every render; only `draft` changes trigger a write.
 */
export function usePreviewWriter<D>(key: PreviewKey, draft: D | null, toDoc: (draft: D) => unknown) {
  const toDocRef = useRef(toDoc);
  useEffect(() => {
    toDocRef.current = toDoc;
  });

  useEffect(() => {
    if (draft === null) return;
    const timer = window.setTimeout(() => writeDraft(key, toDocRef.current(draft)), 300);
    return () => window.clearTimeout(timer);
  }, [key, draft]);

  return useCallback(() => {
    if (draft !== null) writeDraft(key, toDocRef.current(draft));
    window.open(`/admin/preview/${key}`, "_blank");
  }, [key, draft]);
}

/** Preview side: undefined during SSR, null when no draft is stored, else the parsed draft. */
export function usePreviewDraft<T>(key: PreviewKey): T | null | undefined {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const handler = (event: StorageEvent) => {
        if (event.key === storageKey(key)) onChange();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    [key]
  );
  const raw = useSyncExternalStore(subscribe, () => readDraftRaw(key), () => undefined);
  return useMemo(() => {
    if (raw === undefined) return undefined;
    try {
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }, [raw]);
}
