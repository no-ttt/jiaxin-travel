"use client";

import { useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import { SUBCATEGORY_NAME_MAX, duplicateNames, isDuplicate, isValidName, newRegion, type RegionDraft } from "./data";

export default function RegionSubcategoriesSection({
  value: regions,
  onChange,
}: {
  value: RegionDraft[];
  onChange: (updater: (prev: RegionDraft[]) => RegionDraft[]) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const updateRegion = (key: string, name: string) => {
    onChange((prev) => prev.map((region) => (region.key === key ? { ...region, name } : region)));
  };

  // Names are saved trimmed; trimming on blur shows the admin exactly what will be saved.
  const trimRegion = (region: RegionDraft) => {
    if (region.name !== region.name.trim()) updateRegion(region.key, region.name.trim());
  };

  const addRegion = () => {
    onChange((prev) => [...prev, newRegion(prev)]);
  };

  const removeRegion = (region: RegionDraft) => {
    onChange((prev) => prev.filter((item) => item.key !== region.key));
  };

  const duplicates = duplicateNames(regions);

  return (
    <AdminSectionCard
      title="國外團體地區子分類名稱"
      description="管理側邊欄「國外團體」分類展開選單中的地區／國家子分類顯示名稱。此清單為地區標籤的唯一來源，行程資料編輯（前台識別 → 地區標籤）的可選項目會依此清單同步，請勿於兩處分別維護。"
      headerAction={
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex cursor-pointer items-center gap-1 rounded-md bg-[#ECF1FA] px-2.5 py-[5px] text-xs font-medium leading-[1.45em] text-[#0053E0]"
        >
          {collapsed ? "▸ 展開" : "▾ 收合"}
        </button>
      }
    >
      {!collapsed && (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className="flex-1 text-[13px] leading-[1.5em] text-[#535F71]">
              以下欄位對應「國外團體」展開選單中的地區／國家子分類，依畫面上由左到右、由上到下排列。點擊後將以該名稱作為搜尋關鍵字，直接導向搜尋結果頁；此清單同時也是「行程資料編輯」中地區標籤的來源，新增／修改／刪除地區請統一在此處進行，或點擊右側「＋新增地區子分類」新增新的地區。
            </p>
            <button
              type="button"
              onClick={addRegion}
              className="shrink-0 cursor-pointer text-sm font-medium leading-[1.45em] text-[#0053E0]"
            >
              ＋ 新增地區子分類
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {regions.map((region, index) => {
              const duplicated = isDuplicate(duplicates, region.name);
              const invalid = !isValidName(region.name, SUBCATEGORY_NAME_MAX) || duplicated;
              return (
                <div key={region.key} className="flex flex-col gap-[7px]">
                  <span className="text-sm font-bold leading-[1.45em] text-[#090909]">地區 {index + 1} 名稱</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={region.name}
                      maxLength={SUBCATEGORY_NAME_MAX}
                      onChange={(e) => updateRegion(region.key, e.target.value)}
                      onBlur={() => trimRegion(region)}
                      className={`h-11 w-full rounded-xl border bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0] ${
                        invalid ? "border-[#D92D20]" : "border-[#E0E3E8]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeRegion(region)}
                      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] text-sm text-[#535F71] transition hover:border-[#0053E0] hover:bg-[#ECF1FA]"
                      aria-label={`刪除地區${region.name}`}
                    >
                      ×
                    </button>
                  </div>
                  {invalid && (
                    <p className="text-xs leading-[1.45em] text-[#D92D20]">
                      {duplicated ? "名稱重複，請改用其他名稱" : `名稱必填，最多 ${SUBCATEGORY_NAME_MAX} 字`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <AdminInfoNote>
            以上為國外團體地區子分類內容，同時也是「行程資料編輯 → 前台識別 →
            地區標籤」的唯一資料來源；請僅在此處新增／修改／刪除地區，行程端的地區標籤選項會自動同步，不需另外維護。排列順序與顯示開關暫不開放後台調整。
          </AdminInfoNote>
        </>
      )}

    </AdminSectionCard>
  );
}
