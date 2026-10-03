"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import AdminToast from "../ui/AdminToast";
import BasicInfoSection from "./BasicInfoSection";
import BackgroundCoverSection from "./BackgroundCoverSection";
import TripsSection from "./TripsSection";
import {
  collectionPatch,
  isValidColor,
  sameOrder,
  toThemeCollectionDraft,
  tripIds,
  type ThemeCollectionDraft,
} from "./data";
import { ApiError } from "@/lib/api/client";
import { collectionsApi } from "@/lib/api/endpoints/collections";
import { collectionKey, useCollection } from "@/lib/api/hooks/useCollections";
import { useThemes } from "@/lib/api/hooks/useTaxonomy";
import { themeCollectionHref } from "@/components/search/searchUrl";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "請稍後再試";
}

export default function ThemeCollectionEditor({ collectionId }: { collectionId: number }) {
  const queryClient = useQueryClient();
  const { data: collection, isLoading, isError } = useCollection(collectionId);
  const { data: themes } = useThemes();
  const theme = themes?.find((t) => t.collection_id === collectionId);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // `base` is the last server copy. After a save the draft is kept as-is (it is the admin's
  // intent): whatever saved now matches `base`, whatever failed still differs and stays dirty.
  // A new `collection` object resets the draft, except while saving; handleSave marks its own
  // reload as synced before saving ends, so that reload never resets the draft.
  const [synced, setSynced] = useState<typeof collection>(undefined);
  const [base, setBase] = useState<ThemeCollectionDraft | null>(null);
  const [draft, setDraft] = useState<ThemeCollectionDraft | null>(null);
  if (collection && collection !== synced) {
    const fresh = toThemeCollectionDraft(collection);
    setSynced(collection);
    setBase(fresh);
    if (!isSaving) setDraft(fresh);
  }

  const update = (patch: Partial<ThemeCollectionDraft>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const fieldPatch = base && draft ? collectionPatch(base, draft) : null;
  const tripsChanged = base !== null && draft !== null && !sameOrder(tripIds(base.trips), tripIds(draft.trips));
  const isDirty = fieldPatch !== null || tripsChanged;
  const titleMissing = draft !== null && draft.title.trim() === "";
  const isValid =
    draft !== null && !titleMissing && isValidColor(draft.themeColor) && isValidColor(draft.buttonColor);

  /**
   * Fetches straight from the API (throws on failure) and returns the cached object — the same one
   * `useCollection` hands out, which structural sharing may keep when nothing changed.
   */
  const reload = async () => {
    const key = collectionKey(collectionId);
    await queryClient.fetchQuery({ queryKey: key, queryFn: () => collectionsApi.get(collectionId), staleTime: 0 });
    return queryClient.getQueryData<NonNullable<typeof collection>>(key)!;
  };

  const handleSave = async () => {
    if (!base || !draft || !isDirty || !isValid) return;
    setIsSaving(true);
    const errors: unknown[] = [];
    const collect = async (requests: Promise<unknown>[]) => {
      const results = await Promise.allSettled(requests);
      results.forEach((r) => r.status === "rejected" && errors.push(r.reason));
    };

    // Step 1: fields, added trips and removed trips are independent of each other.
    const baseIds = tripIds(base.trips);
    const draftIds = tripIds(draft.trips);
    const removedIds = baseIds.filter((id) => !draftIds.includes(id));
    const [removals] = await Promise.all([
      Promise.allSettled(removedIds.map((id) => collectionsApi.removeTrip(collectionId, id))),
      collect([
        ...(fieldPatch ? [collectionsApi.update(collectionId, fieldPatch)] : []),
        ...draftIds
          .filter((id) => !baseIds.includes(id))
          .map((id) => collectionsApi.addTrip(collectionId, { trip_id: id })),
      ]),
    ]);

    // A failed removal is not retried: the trip goes back to its original place in the list.
    removals.forEach((result) => result.status === "rejected" && errors.push(result.reason));
    const failedRemovalIds = removedIds.filter((_, i) => removals[i].status === "rejected");
    const restoredTrips = base.trips.filter((trip) => failedRemovalIds.includes(trip.id));
    let trips = draft.trips;
    for (const trip of restoredTrips) {
      const index = base.trips.indexOf(trip);
      trips = [...trips.slice(0, index), trip, ...trips.slice(index)];
    }
    if (restoredTrips.length > 0) setDraft((prev) => (prev ? { ...prev, trips } : prev));

    // Step 2: once membership is settled, put the trips that are on the page in the draft's order.
    try {
      if (tripsChanged) {
        const current = tripIds((await reload()).trips);
        const desired = tripIds(trips).filter((id) => current.includes(id));
        if (!sameOrder(current, desired)) await collect([collectionsApi.reorder(collectionId, { trip_ids: desired })]);
      }
      const latest = await reload();
      setSynced(latest);
      setBase(toThemeCollectionDraft(latest));
    } catch (err) {
      errors.push(err);
    }
    setIsSaving(false);

    const retryable = errors.length - restoredTrips.length;
    const messages = [
      restoredTrips.length > 0 &&
        `${restoredTrips.map((trip) => `「${trip.product_name}」`).join("、")}移除失敗，已恢復原本的設定`,
      retryable > 0 && `${retryable} 項儲存失敗，請再按一次「儲存變更」重試`,
    ].filter(Boolean);
    setToast(
      errors.length === 0
        ? { message: "已儲存變更", variant: "success" }
        : { message: `${messages.join("；")}（${errorMessage(errors[0])}）`, variant: "warning" }
    );
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[3px]">
          <Link
            href="/admin/dashboard/categories"
            className="text-[13px] font-medium leading-[1.45em] text-[#535F71] hover:text-[#0053E0]"
          >
            產品分類設定
          </Link>
          <h1 className="text-[28px] font-bold leading-[1.45em] text-[#090909]">
            主題集合頁：{theme?.name ?? collection?.title ?? "…"}
          </h1>
          <p className="text-sm font-medium leading-[1.45em] text-[#535F71]">
            編輯此主題集合頁的標題、標籤與背景視覺，並管理已加入的行程。
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          {theme && (
            <a
              href={themeCollectionHref(theme.id)}
              target="_blank"
              rel="noopener noreferrer"
              title={theme.visible ? "預覽前台已儲存的內容" : "此主題目前隱藏中，前台頁面不對外開放"}
              className="flex h-10 w-[92px] cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] bg-white text-sm font-bold leading-[1.45em] text-[#090909] transition hover:bg-[#F6F6F6]"
            >
              預覽
            </a>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || !isValid || isSaving}
            className="flex h-10 w-[126px] cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] text-sm font-bold leading-[1.45em] text-white transition hover:bg-[#0047BE] disabled:cursor-not-allowed disabled:bg-[#B4BED1] disabled:hover:bg-[#B4BED1]"
          >
            儲存變更
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-[#535F71]">載入中…</p>
      ) : isError || !draft ? (
        <p className="text-sm text-red-600">找不到此主題集合頁，或資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          {isDirty && (
            <p className="text-xs font-medium leading-[1.45em] text-[#535F71]">
              「預覽」顯示的是前台已儲存的內容，請先儲存變更再預覽。
            </p>
          )}

          <BasicInfoSection
            title={draft.title}
            titleError={titleMissing ? "標題必填" : null}
            subtitle={draft.subtitle}
            badgeText={draft.tagText}
            onTitleChange={(title) => update({ title })}
            onSubtitleChange={(subtitle) => update({ subtitle })}
            onBadgeTextChange={(tagText) => update({ tagText })}
          />

          <BackgroundCoverSection
            themeColor={draft.themeColor}
            buttonColor={draft.buttonColor}
            heroMediaId={draft.heroMediaId}
            onThemeColorChange={(themeColor) => update({ themeColor })}
            onButtonColorChange={(buttonColor) => update({ buttonColor })}
            onHeroMediaChange={(heroMediaId) => update({ heroMediaId })}
          />

          <TripsSection
            collectionId={collectionId}
            trips={draft.trips}
            onTripsChange={(trips) => update({ trips })}
          />
        </>
      )}

      {toast && (
        <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
