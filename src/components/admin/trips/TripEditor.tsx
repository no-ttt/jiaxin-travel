"use client";

import { AdminLoading } from "@/components/admin/ui/AdminSpinner";
import { useUnsavedChangesWarning } from "@/components/admin/unsaved/UnsavedChangesProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog";
import AdminToast from "@/components/admin/ui/AdminToast";
import { ApiError } from "@/lib/api/client";
import { tripsApi } from "@/lib/api/endpoints/trips";
import { useTrip } from "@/lib/api/hooks/useTrips";
import { useBadgeOptions, useThemes, useTripStatusOptions } from "@/lib/api/hooks/useTaxonomy";
import type { TaxonomyOption, Theme } from "@/lib/api/types/taxonomy";
import type { TripDetail, TripType } from "@/lib/api/types/trip";
import {
  toTripForm,
  toTripUpdate,
  type TripForm,
  type TripFormPatch,
} from "./form";
import {
  countDaysInRange,
  syncDayCount,
  toDaysPayload,
  toFeatureCardsPayload,
  toFlightsPayload,
  toNoticeTabsPayload,
  toTripContent,
  findIncompleteFeatureCard,
  hasOwnTripContent,
  validateFlights,
  type TripContent,
} from "./content";
import { EDITOR_STEPS, OWN_TRIP_ONLY_STEPS, type EditorStepKey } from "./editor-steps";
import { writePreviewDraft } from "./preview-draft";
import {
  hasThemeRemovals,
  sameIdentityOptions,
  saveIdentityOptions,
  toIdentityOptions,
  type IdentityOptions,
} from "./identity-options";
import EditorStepRail from "./EditorStepRail";
import CoverSection from "./CoverSection";
import BasicInfoSection from "./BasicInfoSection";
import HighlightsSection from "./HighlightsSection";
import FlightSection from "./FlightSection";
import ItinerarySection from "./ItinerarySection";
import PurchaseNoticeSection from "./PurchaseNoticeSection";

/** PATCH succeeded but the trip kept its old type. */
const TRIP_TYPE_UNCHANGED = "行程類型未能變更（其他欄位已儲存）";

function apiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message === TRIP_TYPE_UNCHANGED) return err.message;
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return fallback;
}

type Toast = { message: string; variant: "success" | "warning" } | null;
type EditorDraft = { form: TripForm; content: TripContent };

/** Serialized payload per save step, used both for dirty checks and to decide which requests to send. */
function toPayloads(draft: EditorDraft) {
  return {
    trip: JSON.stringify(toTripUpdate(draft.form)),
    featureCards: JSON.stringify(toFeatureCardsPayload(draft.content.featureCards)),
    flights: JSON.stringify(toFlightsPayload(draft.content.flights)),
    days: JSON.stringify(toDaysPayload(draft.content.days)),
    noticeTabs: JSON.stringify(toNoticeTabsPayload(draft.content.noticeTabs)),
    publishStatus: draft.form.publish_status,
  };
}

/**
 * Keeps sections whose saved payload didn't change, so their row ids (React keys) survive a
 * refetch and nothing re-mounts or flickers; changed sections take the server copy.
 */
function mergeContent(current: TripContent, incoming: TripContent): TripContent {
  const same = <T,>(toPayload: (value: T) => unknown, a: T, b: T) =>
    JSON.stringify(toPayload(a)) === JSON.stringify(toPayload(b));
  return {
    featureCards: same(toFeatureCardsPayload, current.featureCards, incoming.featureCards)
      ? current.featureCards
      : incoming.featureCards,
    flights: same(toFlightsPayload, current.flights, incoming.flights) ? current.flights : incoming.flights,
    days: same(toDaysPayload, current.days, incoming.days) ? current.days : incoming.days,
    noticeTabs: same(toNoticeTabsPayload, current.noticeTabs, incoming.noticeTabs)
      ? current.noticeTabs
      : incoming.noticeTabs,
  };
}

export default function TripEditor({ tripId }: { tripId: string }) {
  const [activeStep, setActiveStep] = useState<EditorStepKey>("cover");
  const isClickScrolling = useRef(false);

  const queryClient = useQueryClient();
  const { data: detail, isError } = useTrip(tripId);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const closeToast = useCallback(() => setToast(null), []);
  // Turned on when a save is blocked by a field: invalid inputs get a red border until fixed.
  const [showErrors, setShowErrors] = useState(false);

  // Reset the draft whenever a fresh server copy arrives (initial load, after save).
  const [syncedDetail, setSyncedDetail] = useState<TripDetail | null>(null);
  const [saved, setSaved] = useState<EditorDraft | null>(null);
  const [draft, setDraft] = useState<EditorDraft | null>(null);
  if (detail && detail !== syncedDetail) {
    const incoming = { form: toTripForm(detail), content: toTripContent(detail) };
    const next = draft ? { ...incoming, content: mergeContent(draft.content, incoming.content) } : incoming;
    setSyncedDetail(detail);
    setSaved(next);
    setDraft(next);
  }

  const hasContent = draft !== null;
  const isExternal = draft?.form.tripType === "external";
  const visibleSteps = isExternal
    ? EDITOR_STEPS.filter((step) => !OWN_TRIP_ONLY_STEPS.includes(step.key))
    : EDITOR_STEPS;
  const isDirty =
    draft !== null &&
    saved !== null &&
    JSON.stringify(toPayloads(draft)) !== JSON.stringify(toPayloads(saved));
  // 識別內容設定 (主題標籤／行程狀態／卡片標章 lists): edited here, applied on 儲存變更 like the trip.
  const { data: themeList } = useThemes();
  const { data: statusList } = useTripStatusOptions();
  const { data: badgeList } = useBadgeOptions();
  const [syncedLists, setSyncedLists] = useState<[Theme[], TaxonomyOption[], TaxonomyOption[]] | null>(null);
  const [optionBase, setOptionBase] = useState<IdentityOptions | null>(null);
  const [options, setOptions] = useState<IdentityOptions | null>(null);
  if (
    themeList &&
    statusList &&
    badgeList &&
    (syncedLists?.[0] !== themeList || syncedLists?.[1] !== statusList || syncedLists?.[2] !== badgeList)
  ) {
    const incoming = toIdentityOptions(themeList, statusList, badgeList);
    // Keep unsaved list edits across a background refetch.
    const hasEdits = options && optionBase && !sameIdentityOptions(options, optionBase);
    setSyncedLists([themeList, statusList, badgeList]);
    setOptionBase(incoming);
    if (!hasEdits) setOptions(incoming);
  }
  const optionsDirty = options !== null && optionBase !== null && !sameIdentityOptions(options, optionBase);
  const hasUnsaved = isDirty || optionsDirty;
  useUnsavedChangesWarning(hasUnsaved);

  // Not a state updater: the day-count sync may ask for confirmation, which must run exactly once.
  const handleFormChange = (patch: TripFormPatch) => {
    if (!draft) return;
    const form = { ...draft.form, ...patch };
    const datesChanged =
      form.base_departure_date !== draft.form.base_departure_date ||
      form.base_return_date !== draft.form.base_return_date;
    const target = datesChanged
      ? countDaysInRange(form.base_departure_date, form.base_return_date)
      : null;
    // Base dates define the itinerary length: add or drop day cards to match.
    const days =
      target === null
        ? draft.content.days
        : syncDayCount(draft.content.days, target, (filled) =>
            window.confirm(
              `新的日期範圍為 ${target} 天，將移除後面 ${filled} 個已填寫內容的日卡，確定嗎？`
            )
          );
    // Declined: keep the previous dates so they stay consistent with the day cards.
    if (days === null) return;
    setDraft({ form, content: { ...draft.content, days } });
  };

  const updateContent = useCallback(
    <K extends keyof TripContent>(key: K) =>
      (updater: (prev: TripContent[K]) => TripContent[K]) =>
        setDraft((prev) =>
          prev ? { ...prev, content: { ...prev.content, [key]: updater(prev.content[key]) } } : prev
        ),
    []
  );

  /** A save blocked by a field: warn, mark the invalid fields red and scroll to the first one. */
  const blockSave = (message: string, step: EditorStepKey) => {
    setToast({ message, variant: "warning" });
    setShowErrors(true);
    setActiveStep(step);
    // Wait for the red borders (and an expanded card) to render, then bring the first one into
    // view just below the pinned header.
    window.requestAnimationFrame(() => {
      const target =
        document.getElementById(step)?.querySelector("[data-invalid]") ?? document.getElementById(step);
      if (!target) return;
      isClickScrolling.current = true;
      const top = target.getBoundingClientRect().top + window.scrollY - stickyOffset() - 48;
      window.scrollTo({ top, behavior: "smooth" });
      if (target instanceof HTMLInputElement) target.focus({ preventScroll: true });
      window.setTimeout(() => {
        isClickScrolling.current = false;
      }, 700);
    });
  };

  const handleSave = async () => {
    if (!draft || !saved) return;
    const flightError = isExternal ? null : validateFlights(draft.content.flights);
    if (flightError) {
      blockSave(flightError, "flights");
      return;
    }
    const incompleteCard = isExternal ? null : findIncompleteFeatureCard(draft.content.featureCards);
    if (incompleteCard) {
      // Open that card so its empty fields are visible.
      updateContent("featureCards")((cards) =>
        cards.map((card) => (card._id === incompleteCard.id ? { ...card, expanded: true } : card))
      );
      blockSave(incompleteCard.message, "highlights");
      return;
    }
    // The backend doesn't check this, but an external trip's frontend CTA needs the link.
    if (isExternal && draft.form.publish_status === "published" && !draft.form.external_url.trim()) {
      blockSave("外部連結行程需填寫「外部連結網址」才能上架", "basic");
      return;
    }
    setShowErrors(false);

    // Option lists first: the trip may use a theme／status／badge that is only created now. Removed
    // themes wait until after the trip is saved (this trip may be the one still using them).
    let draftToSave = draft;
    let pendingThemeRemoval: { base: IdentityOptions; draft: IdentityOptions } | null = null;
    if (options && optionBase && optionsDirty) {
      setIsSaving(true);
      const result = await saveIdentityOptions(optionBase, options, { keepThemes: true });
      const remap = (id: number | null) => (id !== null && id < 0 ? (result.createdIds.get(id) ?? null) : id);
      const remapForm = (f: TripForm): TripForm => ({
        ...f,
        status_id: remap(f.status_id),
        badge_id: remap(f.badge_id),
        theme_ids: f.theme_ids.map(remap).filter((id): id is number => id !== null),
      });
      const remapList = (list: IdentityOptions["statuses"]) =>
        list.map((o) => (o.id < 0 && result.createdIds.has(o.id) ? { ...o, id: result.createdIds.get(o.id)! } : o));
      const remapped = {
        themes: remapList(options.themes),
        statuses: remapList(options.statuses),
        badges: remapList(options.badges),
      };
      setOptionBase(result.saved);
      setOptions(remapped);
      if (!result.error && hasThemeRemovals(result.saved, remapped)) {
        pendingThemeRemoval = { base: result.saved, draft: remapped };
      }
      await queryClient.invalidateQueries({ queryKey: ["taxonomy"] });
      if (result.error) {
        setToast({
          message: `「識別內容設定」儲存失敗：${apiErrorMessage(result.error, "請稍後再試")}`,
          variant: "warning",
        });
        setIsSaving(false);
        return;
      }
      draftToSave = { ...draft, form: remapForm(draft.form) };
      setDraft((current) => (current ? { ...current, form: remapForm(current.form) } : current));
    }

    const next = toPayloads(draftToSave);
    const prev = toPayloads(saved);
    const { form, content } = draftToSave;
    // `commit` copies the step's part of the draft into a baseline once that request succeeded.
    const steps: {
      label: string;
      changed: boolean;
      run: () => Promise<unknown>;
      commit: (base: EditorDraft) => EditorDraft;
    }[] = [
      {
        label: "封面／基本資料",
        changed: next.trip !== prev.trip,
        run: async () => {
          await tripsApi.update(tripId, toTripUpdate(form));
          // The PATCH answers 200 even when it ignores trip_type, so confirm the switch took.
          if (form.tripType !== saved.form.tripType && (await tripsApi.get(tripId)).trip_type !== form.tripType) {
            throw new Error(TRIP_TYPE_UNCHANGED);
          }
        },
        commit: (base) => ({ ...base, form: { ...form, publish_status: base.form.publish_status } }),
      },
      {
        label: "行程特色",
        changed: !isExternal && next.featureCards !== prev.featureCards,
        run: () => tripsApi.putFeatureCards(tripId, toFeatureCardsPayload(content.featureCards)),
        commit: (base) => ({ ...base, content: { ...base.content, featureCards: content.featureCards } }),
      },
      {
        label: "航程資訊",
        changed: !isExternal && next.flights !== prev.flights,
        run: () => tripsApi.putFlights(tripId, toFlightsPayload(content.flights)),
        commit: (base) => ({ ...base, content: { ...base.content, flights: content.flights } }),
      },
      {
        label: "每日行程",
        changed: !isExternal && next.days !== prev.days,
        run: () => tripsApi.putDays(tripId, toDaysPayload(content.days)),
        commit: (base) => ({ ...base, content: { ...base.content, days: content.days } }),
      },
      {
        label: "訂購須知",
        changed: next.noticeTabs !== prev.noticeTabs,
        run: () => tripsApi.putNoticeTabs(tripId, toNoticeTabsPayload(content.noticeTabs)),
        commit: (base) => ({ ...base, content: { ...base.content, noticeTabs: content.noticeTabs } }),
      },
      // Publish last so a rejected publish (e.g. empty cover) doesn't block saving content.
      {
        label: "上架狀態",
        changed: next.publishStatus !== prev.publishStatus,
        run: () => tripsApi.update(tripId, { publish_status: form.publish_status }),
        commit: (base) => ({ ...base, form: { ...base.form, publish_status: form.publish_status } }),
      },
    ];

    setIsSaving(true);
    const done: string[] = [];
    let baseline = saved;
    try {
      for (const step of steps.filter((s) => s.changed)) {
        try {
          await step.run();
          done.push(step.label);
          baseline = step.commit(baseline);
        } catch (err) {
          // Keep the draft as-is (no refetch) so unsaved edits aren't lost, but advance the
          // baseline past the steps that did succeed so a retry only re-sends what failed.
          setSaved(baseline);
          const savedPart = done.length ? `（已儲存：${done.join("、")}）` : "";
          setToast({
            message: `「${step.label}」儲存失敗：${apiErrorMessage(err, "請稍後再試")}${savedPart}`,
            variant: "warning",
          });
          return;
        }
      }
      if (pendingThemeRemoval) {
        const removal = await saveIdentityOptions(pendingThemeRemoval.base, pendingThemeRemoval.draft);
        setOptionBase(removal.saved);
        // A theme another trip still uses stays (the backend refuses with 409); show it again.
        if (removal.error) setOptions(removal.saved);
        await queryClient.invalidateQueries({ queryKey: ["taxonomy"] });
        if (removal.error) {
          setToast({
            message: `主題標籤未能移除：${apiErrorMessage(removal.error, "請稍後再試")}（其他內容已儲存）`,
            variant: "warning",
          });
          await queryClient.invalidateQueries({ queryKey: ["trips"] });
          return;
        }
      }
      setToast({ message: "已儲存變更", variant: "success" });
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
    } finally {
      setIsSaving(false);
    }
  };

  /** Type switches in place on the draft and is sent with 儲存變更 (same trip, code and status). */
  const [pendingTripType, setPendingTripType] = useState<TripType | null>(null);
  const applyTripType = (tripType: TripType) =>
    setDraft((current) => (current ? { ...current, form: { ...current.form, tripType } } : current));

  const requestTripType = (type: TripType) => {
    if (!draft) return;
    // Only ask when the other type's fields have something filled in.
    const hasFilled =
      type === "external"
        ? hasOwnTripContent(draft.content)
        : Boolean(draft.form.external_url.trim() || draft.form.source_agency.trim());
    if (hasFilled) setPendingTripType(type);
    else applyTripType(type);
  };

  // Once a preview tab is open, keep its draft in sync so it re-renders as the admin edits.
  const isPreviewOpen = useRef(false);
  const tripCode = detail?.trip_code;
  useEffect(() => {
    if (!isPreviewOpen.current || !draft || !tripCode) return;
    const timer = window.setTimeout(() => writePreviewDraft(tripId, { tripCode, ...draft }), 300);
    return () => window.clearTimeout(timer);
  }, [draft, tripId, tripCode]);

  /** Opens the unsaved draft in the public trip layout; nothing is sent to the API. */
  const handlePreview = () => {
    if (!draft || !tripCode) return;
    writePreviewDraft(tripId, { tripCode, ...draft });
    const tab = window.open(`/admin/trip-preview/${tripId}`, "_blank");
    if (!tab) {
      setToast({ message: "瀏覽器封鎖了預覽視窗，請允許此網站開啟彈出式視窗", variant: "warning" });
      return;
    }
    isPreviewOpen.current = true;
  };

  // Height of the pinned header + step rail, so sections land just below it.
  const stickyRef = useRef<HTMLDivElement>(null);
  const stickyOffset = () => (stickyRef.current?.offsetHeight ?? 200) + 4;

  useEffect(() => {
    const sections = EDITOR_STEPS.map((step) => document.getElementById(step.key)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const key = visible[0].target.id as EditorStepKey;
          setActiveStep(key);
        }
      },
      { rootMargin: `-${stickyOffset() + 20}px 0px -60% 0px`, threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [hasContent, isExternal]);

  const handleSelectStep = (step: EditorStepKey) => {
    setActiveStep(step);
    const target = document.getElementById(step);
    if (!target) return;
    isClickScrolling.current = true;
    const top = target.getBoundingClientRect().top + window.scrollY - stickyOffset();
    window.scrollTo({ top, behavior: "smooth" });
    window.setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header + step rail stay pinned together while scrolling. */}
      <div ref={stickyRef} className="sticky top-0 z-30 -mb-4 -mt-6 flex flex-col gap-7 bg-[#FAFAFA] pb-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[3px]">
            <Link
              href="/admin/dashboard/trips"
              className="text-[13px] font-medium leading-[1.45em] text-[#535F71] hover:text-[#0053E0]"
            >
              行程產品管理
            </Link>
            <h1 className="text-[28px] font-bold leading-[1.45em] text-[#090909]">行程頁資料</h1>
            <p className="text-sm font-medium leading-[1.45em] text-[#535F71]">
              依序填寫行程內容，完成後可預覽。
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handlePreview}
              disabled={!draft}
              className="flex h-10 w-[92px] cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] bg-white text-sm font-bold leading-[1.45em] text-[#090909] transition hover:bg-[#F6F6F6]"
            >
              預覽
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasUnsaved || isSaving}
              className="flex h-10 w-[126px] cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] text-sm font-bold leading-[1.45em] text-white transition hover:bg-[#0047BE] disabled:cursor-not-allowed disabled:bg-[#B4BED1] disabled:hover:bg-[#B4BED1]"
            >
              儲存變更
            </button>
          </div>
        </div>

        <EditorStepRail activeStep={activeStep} onSelect={handleSelectStep} steps={visibleSteps} />
      </div>

      {!draft && !isError ? (
        <AdminLoading />
      ) : !draft ? (
        <p className="text-sm text-red-600">行程資料載入失敗，請重新整理頁面</p>
      ) : (
        <div className="flex flex-col gap-5">
          {visibleSteps.map((step) => (
            <div key={step.key} id={step.key} className="scroll-mt-[220px]">
              {step.key === "cover" ? (
                <CoverSection
                  title={step.title}
                  description={step.description}
                  value={draft.form}
                  onChange={handleFormChange}
                />
              ) : step.key === "basic" ? (
                <BasicInfoSection
                  title={step.title}
                  description={step.description}
                  value={draft.form}
                  onChange={handleFormChange}
                  onTripTypeChange={requestTripType}
                  options={options}
                  onOptionsChange={setOptions}
                  showErrors={showErrors}
                />
              ) : step.key === "highlights" ? (
                <HighlightsSection
                  title={step.title}
                  description={step.description}
                  value={draft.content.featureCards}
                  onChange={updateContent("featureCards")}
                  showErrors={showErrors}
                />
              ) : step.key === "flights" ? (
                <FlightSection
                  title={step.title}
                  description={step.description}
                  value={draft.content.flights}
                  onChange={updateContent("flights")}
                  showErrors={showErrors}
                />
              ) : step.key === "itinerary" ? (
                <ItinerarySection
                  title={step.title}
                  description={step.description}
                  startDate={draft.form.base_departure_date ?? ""}
                  value={draft.content.days}
                  onChange={updateContent("days")}
                />
              ) : (
                <PurchaseNoticeSection
                  title={step.title}
                  description={step.description}
                  value={draft.content.noticeTabs}
                  onChange={updateContent("noticeTabs")}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {pendingTripType && (
        <AdminConfirmDialog
          title={pendingTripType === "external" ? "改為外部連結行程" : "改為自建行程"}
          message={
            pendingTripType === "external"
              ? "行程特色、航程資訊、每日行程已填寫的內容將不會儲存。"
              : "確定要改為自建行程嗎？"
          }
          confirmLabel="確定變更"
          onCancel={() => setPendingTripType(null)}
          onConfirm={() => {
            applyTripType(pendingTripType);
            setPendingTripType(null);
          }}
        />
      )}

      {toast && <AdminToast message={toast.message} variant={toast.variant} onClose={closeToast} />}
    </div>
  );
}
