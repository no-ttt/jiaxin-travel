"use client";

import { useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import { generateId } from "../ui/generateId";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import { INITIAL_REGION_SUBCATEGORIES, type RegionSubcategory } from "./data";

export default function RegionSubcategoriesSection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [regions, setRegions] = useState<RegionSubcategory[]>(INITIAL_REGION_SUBCATEGORIES);
  const [collapsed, setCollapsed] = useState(false);
  useDirtyTracking(regions, onDirtyChange, resetKey);

  const updateRegion = (id: string, name: string) => {
    setRegions((prev) => prev.map((region) => (region.id === id ? { ...region, name } : region)));
  };

  const addRegion = () => {
    setRegions((prev) => [...prev, { id: generateId("region"), name: "" }]);
  };

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
            {regions.map((region, index) => (
              <div key={region.id} className="flex flex-col gap-[7px]">
                <span className="text-sm font-bold leading-[1.45em] text-[#090909]">地區 {index + 1} 名稱</span>
                <input
                  type="text"
                  value={region.name}
                  onChange={(e) => updateRegion(region.id, e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                />
              </div>
            ))}
          </div>

          <AdminInfoNote>
            以上為國外團體地區子分類內容，同時也是「行程資料編輯 → 前台識別 →
            地區標籤」的唯一資料來源；請僅在此處新增／修改地區，行程端的地區標籤選項會自動同步，不需另外維護。排列順序與顯示開關暫不開放後台調整。
          </AdminInfoNote>
        </>
      )}
    </AdminSectionCard>
  );
}
