"use client";

import { useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminToast from "@/components/admin/ui/AdminToast";
import BannerSection from "@/components/admin/homepage/BannerSection";
import StoryVideoSection from "@/components/admin/homepage/StoryVideoSection";
import SearchKeywordsSection from "@/components/admin/homepage/SearchKeywordsSection";
import CategorySection from "@/components/admin/homepage/CategorySection";
import FeatureSection from "@/components/admin/homepage/FeatureSection";
import TestimonialSection from "@/components/admin/homepage/TestimonialSection";
import {
  fromEditableHomepage,
  isSameHomepage,
  toEditableHomepage,
  type EditableHomepage,
} from "@/components/admin/homepage/data";
import { useCmsDocument, usePutCmsDocument } from "@/lib/api/hooks/useCms";
import { ApiError } from "@/lib/api/client";
import type { HomepageDoc } from "@/lib/api/types/cms";

const CMS_KEY = "homepage";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "儲存失敗，請稍後再試";
}

export default function AdminHomepagePage() {
  const { data: doc, isLoading, isError } = useCmsDocument<HomepageDoc>(CMS_KEY);
  const putDocument = usePutCmsDocument<HomepageDoc>(CMS_KEY);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(
    null
  );

  // Reset the draft whenever a fresh server copy arrives (initial load, after save).
  const [syncedData, setSyncedData] = useState<HomepageDoc | null>(null);
  const [draft, setDraft] = useState<EditableHomepage | null>(null);
  if (doc && doc.data !== syncedData) {
    setSyncedData(doc.data);
    setDraft(toEditableHomepage(doc.data));
  }

  const isDirty =
    draft !== null &&
    syncedData !== null &&
    !isSameHomepage(fromEditableHomepage(draft), syncedData);

  const updateField =
    <K extends keyof EditableHomepage>(key: K) =>
    (updater: (prev: EditableHomepage[K]) => EditableHomepage[K]) =>
      setDraft((prev) => (prev ? { ...prev, [key]: updater(prev[key]) } : prev));

  const handleSave = () => {
    if (!draft) return;
    putDocument.mutate(fromEditableHomepage(draft), {
      onSuccess: () => setToast({ message: "已儲存變更", variant: "success" }),
      onError: (err) => setToast({ message: errorMessage(err), variant: "warning" }),
    });
  };

  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        title="官網首頁"
        description="編輯首頁內容，包含橫幅輪播、精選行程、旅遊故事、品牌堅持與客戶好評。"
        onSave={handleSave}
        saveDisabled={!isDirty || putDocument.isPending}
      />

      {isLoading ? (
        <p className="text-sm text-[#535F71]">載入中…</p>
      ) : isError || !draft ? (
        <p className="text-sm text-red-600">首頁資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          <BannerSection value={draft.banners} onChange={updateField("banners")} />
          <StoryVideoSection value={draft.videos} onChange={updateField("videos")} />
          <SearchKeywordsSection value={draft.quick_keywords} onChange={updateField("quick_keywords")} />
          <CategorySection value={draft.featured} onChange={updateField("featured")} />
          <FeatureSection value={draft.brand_features} onChange={updateField("brand_features")} />
          <TestimonialSection value={draft.testimonials} onChange={updateField("testimonials")} />
        </>
      )}

      {toast && (
        <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
