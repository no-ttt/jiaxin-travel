"use client";

import { useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import { generateId } from "../ui/generateId";
import ToggleSwitch from "../ui/ToggleSwitch";
import { INITIAL_LUXURY_SUBCATEGORIES, SUBCATEGORY_NAME_MAX, type LuxurySubcategory } from "./data";

/**
 * 後端尚無精緻璽品子分類 API：此區塊僅本地編輯，不列入「儲存變更」。
 * 版面比照「主題旅遊子類別名稱」（ThemeSubcategoriesSection）。
 */
export default function LuxurySubcategoriesSection() {
  const [subcategories, setSubcategories] = useState<LuxurySubcategory[]>(INITIAL_LUXURY_SUBCATEGORIES);
  const [collapsed, setCollapsed] = useState(false);

  const updateSubcategory = (id: string, patch: Partial<LuxurySubcategory>) => {
    setSubcategories((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeSubcategory = (id: string) => {
    setSubcategories((prev) => prev.filter((item) => item.id !== id));
  };

  const addSubcategory = () => {
    setSubcategories((prev) => [...prev, { id: generateId("luxury"), name: "", visible: true }]);
  };

  return (
    <AdminSectionCard
      title="精緻璽品子分類名稱"
      description="管理「精緻璽品」展開選單中的子分類顯示名稱。每個子分類可個別開關「顯示於前台」——若目前沒有該分類的行程，可先關閉暫時隱藏；也可點擊「＋新增子分類」建立新的子分類。側邊欄「精緻璽品」的子選單需於上方開啟，子分類才會顯示。"
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
      <p className="rounded-lg bg-[#FFF7E6] px-3 py-2 text-xs font-medium leading-[1.45em] text-[#B45309]">
        此區塊尚未串接後端，修改不會儲存。
      </p>

      {!collapsed && (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className="flex-1 text-[13px] leading-[1.5em] text-[#535F71]">
              以下欄位對應「精緻璽品」展開選單中的子分類，依畫面上由左到右、由上到下排列。可透過「顯示於前台」開關暫時隱藏目前沒有行程的子分類，或點擊右側「＋新增子分類」新增新的子分類。
            </p>
            <button
              type="button"
              onClick={addSubcategory}
              className="shrink-0 cursor-pointer text-sm font-medium leading-[1.45em] text-[#0053E0]"
            >
              ＋ 新增子分類
            </button>
          </div>

          {subcategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {subcategories.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex flex-col gap-[7px] rounded-xl border border-[#E0E3E8] p-4 ${
                    item.visible ? "" : "opacity-55"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-bold leading-[1.45em] text-[#090909]">
                      子分類 {index + 1} 名稱
                    </span>
                    {!item.visible && (
                      <span className="text-[11px] font-medium leading-[1.45em] text-[#535F71]">
                        （已隱藏，暫不顯示於前台選單）
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs leading-[1.45em] text-[#535F71]">顯示於前台</span>
                      <ToggleSwitch
                        size="sm"
                        checked={item.visible}
                        onChange={() => updateSubcategory(item.id, { visible: !item.visible })}
                        label={`切換${item.name || "子分類"}顯示`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.name}
                      maxLength={SUBCATEGORY_NAME_MAX}
                      onChange={(e) => updateSubcategory(item.id, { name: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubcategory(item.id)}
                      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] text-sm text-[#535F71] transition hover:border-[#0053E0] hover:bg-[#ECF1FA]"
                      aria-label="刪除子分類"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-[#E0E3E8] px-4 py-6 text-center text-[13px] leading-[1.5em] text-[#535F71]">
              目前尚未設定任何子分類，點擊右上方「＋ 新增子分類」開始新增。
            </p>
          )}

          <AdminInfoNote>
            排列順序暫不開放後台調整。「顯示於前台」關閉時，該子分類不會出現在前台選單中；側邊欄「精緻璽品」的子選單關閉時，整個子分類選單都不會顯示。
          </AdminInfoNote>
        </>
      )}
    </AdminSectionCard>
  );
}
