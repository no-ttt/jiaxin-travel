"use client";

import { useCallback, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminToast from "@/components/admin/ui/AdminToast";
import BannerSection from "@/components/admin/homepage/BannerSection";
import StoryVideoSection from "@/components/admin/homepage/StoryVideoSection";
import SearchKeywordsSection from "@/components/admin/homepage/SearchKeywordsSection";
import CategorySection from "@/components/admin/homepage/CategorySection";
import FeatureSection from "@/components/admin/homepage/FeatureSection";
import TestimonialSection from "@/components/admin/homepage/TestimonialSection";

const SECTION_KEYS = ["banner", "video", "keywords", "category", "feature", "testimonial"] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

export default function AdminHomepagePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dirtyMap, setDirtyMap] = useState<Record<SectionKey, boolean>>({
    banner: false,
    video: false,
    keywords: false,
    category: false,
    feature: false,
    testimonial: false,
  });

  const makeDirtyHandler = useCallback(
    (key: SectionKey) => (dirty: boolean) => {
      setDirtyMap((prev) => (prev[key] === dirty ? prev : { ...prev, [key]: dirty }));
    },
    []
  );

  const isDirty = useMemo(() => Object.values(dirtyMap).some(Boolean), [dirtyMap]);
  const [saveCount, setSaveCount] = useState(0);

  const handleSave = () => {
    setToastMessage("已儲存變更");
    setSaveCount((count) => count + 1);
  };

  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        title="官網首頁"
        description="編輯首頁內容，包含橫幅輪播、精選行程、旅遊故事、品牌堅持與客戶好評。"
        onSave={handleSave}
        saveDisabled={!isDirty}
      />
      <BannerSection onDirtyChange={makeDirtyHandler("banner")} resetKey={saveCount} />
      <StoryVideoSection onDirtyChange={makeDirtyHandler("video")} resetKey={saveCount} />
      <SearchKeywordsSection onDirtyChange={makeDirtyHandler("keywords")} resetKey={saveCount} />
      <CategorySection onDirtyChange={makeDirtyHandler("category")} resetKey={saveCount} />
      <FeatureSection onDirtyChange={makeDirtyHandler("feature")} resetKey={saveCount} />
      <TestimonialSection onDirtyChange={makeDirtyHandler("testimonial")} resetKey={saveCount} />

      {toastMessage && <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
