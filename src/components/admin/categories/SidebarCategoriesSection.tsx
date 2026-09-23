"use client";

import { useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import AdminTextInput from "../ui/AdminTextInput";
import ToggleSwitch from "../ui/ToggleSwitch";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import { INITIAL_SIDEBAR_CATEGORIES, type SidebarCategory } from "./data";

export default function SidebarCategoriesSection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [categories, setCategories] = useState<SidebarCategory[]>(INITIAL_SIDEBAR_CATEGORIES);
  useDirtyTracking(categories, onDirtyChange, resetKey);

  const updateCategory = (id: string, patch: Partial<SidebarCategory>) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...patch } : cat)));
  };

  const fixedCategories = categories.filter((cat) => !cat.hasSubmenu);

  return (
    <AdminSectionCard
      title="側邊欄大分類名稱"
      description="管理首頁側邊欄由上到下的 9 個大分類顯示名稱。其中「國外團體」「主題旅遊」「精緻璽品」可開關子選單——開啟時子分類請於對應區塊編輯，關閉時導向所設定的頁面網址；其餘 6 個分類固定為導向頁面網址，無子選單。"
    >
      <p className="text-[13px] leading-[1.5em] text-[#535F71]">
        以下 9 個欄位由上到下對應首頁側邊欄的大分類；每個分類的圖示與排序暫不開放後台調整，僅可編輯顯示名稱。
      </p>

      <div className="flex flex-col gap-5">
        {categories
          .filter((cat) => cat.hasSubmenu)
          .map((cat, index) => (
            <div key={cat.id} className="flex flex-col gap-[7px]">
              <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">分類 {index + 1} 名稱</span>
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateCategory(cat.id, { name: e.target.value })}
                className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
              />
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-medium leading-[1.45em] text-[#002366]">子選單</span>
                <ToggleSwitch
                  checked={cat.submenuEnabled}
                  onChange={() => updateCategory(cat.id, { submenuEnabled: !cat.submenuEnabled })}
                  label={`切換${cat.name}子選單`}
                />
                {cat.submenuEnabled ? (
                  <p className="text-xs leading-[1.45em] text-[#0053E0]">{cat.submenuNote}</p>
                ) : (
                  <>
                    <input
                      type="text"
                      value={cat.linkUrl}
                      onChange={(e) => updateCategory(cat.id, { linkUrl: e.target.value })}
                      placeholder="導向網址（子選單關閉時使用，選填）"
                      className="h-8 w-[430px] rounded-lg border border-[#E0E3E8] bg-white px-3 text-xs leading-[1.45em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                    />
                    <p className="text-xs leading-[1.45em] text-[#0053E0]">{cat.submenuNote}</p>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fixedCategories.map((cat) => {
          const index = categories.findIndex((c) => c.id === cat.id);
          return (
            <div key={cat.id} className="flex flex-col gap-4">
              <AdminTextInput
                label={`分類 ${index + 1} 名稱`}
                value={cat.name}
                onChange={(value) => updateCategory(cat.id, { name: value })}
              />
              <div className="flex flex-col gap-[7px]">
                <span className="text-sm font-bold leading-[1.45em] text-[#090909]">導向頁面網址</span>
                <input
                  type="text"
                  value={cat.linkUrl}
                  onChange={(e) => updateCategory(cat.id, { linkUrl: e.target.value })}
                  placeholder="導向網址（站內／外部皆可，選填）"
                  className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#535F71] outline-none focus:border-[#0053E0]"
                />
              </div>
            </div>
          );
        })}
      </div>

      <AdminInfoNote>
        以上為側邊欄全部 9 個大分類；圖示與排序暫不開放後台調整。僅「國外團體」「主題旅遊」「精緻璽品」3
        項具備子選單開關，其餘 6 項（客製包團、美安專區、機票、簽證、旅客服務、旅程分享）恆為導向頁面網址，網址可填站內頁面路徑，也可填外部網站連結。
      </AdminInfoNote>
    </AdminSectionCard>
  );
}
