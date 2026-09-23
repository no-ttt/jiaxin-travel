"use client";

import { useState } from "react";
import Link from "next/link";
import AdminToast from "../ui/AdminToast";
import BasicInfoSection from "./BasicInfoSection";
import BackgroundCoverSection from "./BackgroundCoverSection";
import TripsSection from "./TripsSection";
import { INITIAL_THEME_COLLECTIONS, type ThemeCollectionPage } from "./data";

export default function ThemeCollectionEditor({ themeId }: { themeId: string }) {
  const initial: ThemeCollectionPage = INITIAL_THEME_COLLECTIONS[themeId] ?? {
    id: themeId,
    themeName: "未命名",
    title: "",
    subtitle: "",
    badgeText: "",
    themeColor: "#14111A",
    buttonColor: "#FF5C00",
    heroImage: null,
    heroImageName: "",
    trips: [],
  };

  const [page, setPage] = useState<ThemeCollectionPage>(initial);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const update = (patch: Partial<ThemeCollectionPage>) => {
    setPage((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    setToastMessage("已儲存變更");
  };

  return (
    <div className="flex w-[1012px] flex-col gap-7">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[3px]">
          <Link
            href="/admin/dashboard/categories"
            className="text-[13px] font-medium leading-[1.45em] text-[#535F71] hover:text-[#0053E0]"
          >
            產品分類設定
          </Link>
          <h1 className="text-[28px] font-bold leading-[1.45em] text-[#090909]">
            主題集合頁：{page.themeName}
          </h1>
          <p className="text-sm font-medium leading-[1.45em] text-[#535F71]">
            編輯此主題集合頁的標題、標籤與背景視覺，並管理已加入的行程。
          </p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          <button
            type="button"
            className="flex h-10 w-[92px] cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] bg-white text-sm font-bold leading-[1.45em] text-[#090909] transition hover:bg-[#F6F6F6]"
          >
            預覽
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex h-10 w-[126px] cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] text-sm font-bold leading-[1.45em] text-white transition hover:bg-[#0047BE]"
          >
            儲存變更
          </button>
        </div>
      </div>

      <BasicInfoSection
        title={page.title}
        subtitle={page.subtitle}
        badgeText={page.badgeText}
        onTitleChange={(title) => update({ title })}
        onSubtitleChange={(subtitle) => update({ subtitle })}
        onBadgeTextChange={(badgeText) => update({ badgeText })}
      />

      <BackgroundCoverSection
        themeColor={page.themeColor}
        buttonColor={page.buttonColor}
        heroImageName={page.heroImageName}
        onThemeColorChange={(themeColor) => update({ themeColor })}
        onButtonColorChange={(buttonColor) => update({ buttonColor })}
      />

      <TripsSection trips={page.trips} onTripsChange={(trips) => update({ trips })} />

      {toastMessage && <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
