"use client";

import { use, useCallback, useMemo, useSyncExternalStore } from "react";
import { useQueries } from "@tanstack/react-query";
import TripDetailView from "@/components/trip-detail/TripDetailView";
import { toTripDetail } from "@/components/trip-detail/fromApi";
import {
  parsePreviewDraft,
  readPreviewDraftRaw,
  subscribePreviewDraft,
} from "@/components/admin/trips/preview-draft";
import { draftMediaIds, toPreviewTrip } from "@/components/admin/trips/toPreviewTrip";
import { mediaApi } from "@/lib/api/endpoints/media";
import { mediaKey } from "@/lib/api/hooks/useMedia";
import { useBadgeOptions, useTripStatusOptions } from "@/lib/api/hooks/useTaxonomy";
import type { Media } from "@/lib/api/types/media";

/**
 * 後台「預覽」: renders the editor's unsaved draft (handed over via localStorage) with the
 * public trip page's layout. Updates live while the editor tab keeps editing.
 */
export default function TripPreviewPage({ params }: PageProps<"/admin/trip-preview/[id]">) {
  const { id } = use(params);
  const subscribe = useCallback((onChange: () => void) => subscribePreviewDraft(id, onChange), [id]);
  // undefined on the server (no localStorage), null when there's no stored draft.
  const raw = useSyncExternalStore(
    subscribe,
    () => readPreviewDraftRaw(id),
    () => undefined
  );
  const draft = useMemo(() => (raw === undefined ? undefined : parsePreviewDraft(raw)), [raw]);

  const mediaIds = useMemo(() => (draft ? draftMediaIds(draft) : []), [draft]);
  const mediaResults = useQueries({
    queries: mediaIds.map((mediaId) => ({
      queryKey: mediaKey(mediaId),
      queryFn: () => mediaApi.get(mediaId),
      staleTime: Infinity,
    })),
  });
  const { data: statuses } = useTripStatusOptions();
  const { data: badges } = useBadgeOptions();

  const media = new Map<string, Media>();
  mediaResults.forEach((result) => {
    if (result.data) media.set(result.data.id, result.data);
  });

  if (draft === undefined) return null;
  if (draft === null) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center text-sm text-[#535F71]">
        找不到預覽內容，請從後台行程編輯頁按「預覽」開啟。
      </div>
    );
  }

  const trip = toTripDetail(toPreviewTrip(draft, { media, statuses, badges }));
  return (
    <>
      <title>{`預覽｜${trip.seoTitle || trip.title || "未命名行程"}`}</title>
      <TripDetailView
        trip={trip}
        previewNotice="預覽模式：顯示的是後台尚未儲存的內容，一般訪客看不到。編輯頁修改後會自動更新。"
      />
    </>
  );
}
