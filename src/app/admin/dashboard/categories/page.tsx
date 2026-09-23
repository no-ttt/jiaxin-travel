"use client";

import { useCallback, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminToast from "@/components/admin/ui/AdminToast";
import SidebarCategoriesSection from "@/components/admin/categories/SidebarCategoriesSection";
import RegionSubcategoriesSection from "@/components/admin/categories/RegionSubcategoriesSection";
import LuxurySubcategoriesSection from "@/components/admin/categories/LuxurySubcategoriesSection";
import ThemeSubcategoriesSection from "@/components/admin/categories/ThemeSubcategoriesSection";

const SECTION_KEYS = ["sidebar", "region", "luxury", "theme"] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

export default function AdminCategoriesPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dirtyMap, setDirtyMap] = useState<Record<SectionKey, boolean>>({
    sidebar: false,
    region: false,
    luxury: false,
    theme: false,
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
        title="產品分類設定"
        description="管理首頁側邊欄大分類、各分類的子選單開關，以及「國外團體」地區子分類與「主題旅遊」子類別的顯示名稱。"
        onSave={handleSave}
        saveDisabled={!isDirty}
      />
      <SidebarCategoriesSection onDirtyChange={makeDirtyHandler("sidebar")} resetKey={saveCount} />
      <RegionSubcategoriesSection onDirtyChange={makeDirtyHandler("region")} resetKey={saveCount} />
      <LuxurySubcategoriesSection onDirtyChange={makeDirtyHandler("luxury")} resetKey={saveCount} />
      <ThemeSubcategoriesSection onDirtyChange={makeDirtyHandler("theme")} resetKey={saveCount} />

      {toastMessage && <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
