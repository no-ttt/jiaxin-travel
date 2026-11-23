"use client";

import { useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import ToggleSwitch from "../ui/ToggleSwitch";
import {
  SUBCATEGORY_NAME_MAX,
  duplicateNames,
  isDuplicate,
  isValidName,
  newPremiumSubcategory,
  type PremiumSubcategoryDraft,
} from "./data";

/**
 * 精緻璽品子分類 (/admin/taxonomy/premium-subcategories), saved with the page's「儲存變更」.
 * 版面比照「主題旅遊子類別名稱」（ThemeSubcategoriesSection）。Removing a saved row deletes it on
 * save; the API refuses while trips are still tagged with it (shown in the page's「無法刪除」dialog).
 */
export default function LuxurySubcategoriesSection({
  value: subcategories,
  onChange,
}: {
  value: PremiumSubcategoryDraft[];
  onChange: (
    updater: (prev: PremiumSubcategoryDraft[]) => PremiumSubcategoryDraft[],
  ) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const updateSubcategory = (
    key: string,
    patch: Partial<PremiumSubcategoryDraft>,
  ) => {
    onChange((prev) =>
      prev.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  };

  const removeSubcategory = (key: string) => {
    onChange((prev) => prev.filter((item) => item.key !== key));
  };

  const addSubcategory = () => {
    onChange((prev) => [...prev, newPremiumSubcategory(prev)]);
  };

  const duplicates = duplicateNames(subcategories);
  const isEmpty = subcategories.length === 0;

  return (
    <AdminSectionCard
      title="精緻璽品子分類名稱"
      description={
        isEmpty
          ? "管理側邊欄「精緻璽品」分類子選單開啟後顯示的子分類名稱；目前尚未設定任何子分類。"
          : "管理側邊欄「精緻璽品」分類子選單開啟後顯示的子分類名稱。"
      }
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
      {!collapsed && isEmpty && (
        <>
          <button
            type="button"
            onClick={addSubcategory}
            className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E0E3E8] bg-[#FAFAFA] hover:border-[#0053E0]"
          >
            <span className="text-[13px] font-medium text-[#002366]">
              尚未設定子分類內容
            </span>
            <span className="text-xs text-[#0053E0]">
              ＋ 新增子分類，開始建立「精緻璽品」的子分類選單
            </span>
          </button>
        </>
      )}
      {!collapsed && !isEmpty && (
        <>
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={addSubcategory}
              className="shrink-0 cursor-pointer text-sm font-medium leading-[1.45em] text-[#0053E0]"
            >
              ＋ 新增子分類
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {subcategories.map((item, index) => {
              const duplicated = isDuplicate(duplicates, item.name);
              const invalid =
                !isValidName(item.name, SUBCATEGORY_NAME_MAX) || duplicated;
              return (
                <div
                  key={item.key}
                  className={`flex flex-col gap-[7px] rounded-xl border border-[#E0E3E8] p-4 ${
                    item.visible ? "" : "opacity-55"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-bold leading-[1.45em] text-[#090909]">
                      子分類 {index + 1} 名稱
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs leading-[1.45em] text-[#535F71]">
                        顯示於前台
                      </span>
                      <ToggleSwitch
                        size="sm"
                        checked={item.visible}
                        onChange={() =>
                          updateSubcategory(item.key, {
                            visible: !item.visible,
                          })
                        }
                        label={`切換${item.name || "子分類"}顯示`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.name}
                      maxLength={SUBCATEGORY_NAME_MAX}
                      onChange={(e) =>
                        updateSubcategory(item.key, { name: e.target.value })
                      }
                      onBlur={() =>
                        item.name !== item.name.trim() &&
                        updateSubcategory(item.key, {
                          name: item.name.trim(),
                        })
                      }
                      className={`h-11 w-full rounded-xl border bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0] ${
                        invalid ? "border-[#D92D20]" : "border-[#E0E3E8]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeSubcategory(item.key)}
                      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] text-sm text-[#535F71] transition hover:border-[#0053E0] hover:bg-[#ECF1FA]"
                      aria-label="刪除子分類"
                    >
                      ×
                    </button>
                  </div>
                  {invalid && (
                    <p className="text-xs leading-[1.45em] text-[#D92D20]">
                      {duplicated
                        ? "名稱重複，請改用其他名稱"
                        : `名稱必填，最多 ${SUBCATEGORY_NAME_MAX} 字`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </>
      )}
      {!collapsed && (
        <AdminInfoNote icon={false}>
          此區塊會在上方「精緻璽品」的子選單開關開啟後於前台生效；目前開關為關閉狀態，此處僅預覽日後新增子分類的位置。
        </AdminInfoNote>
      )}
    </AdminSectionCard>
  );
}
