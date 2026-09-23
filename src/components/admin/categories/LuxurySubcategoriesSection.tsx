"use client";

import { useState } from "react";
import AdminSectionCard from "../ui/AdminSectionCard";
import AdminAddButton from "../ui/AdminAddButton";
import { generateId } from "../ui/generateId";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import ToggleSwitch from "../ui/ToggleSwitch";
import { INITIAL_LUXURY_SUBCATEGORIES, type LuxurySubcategory } from "./data";

export default function LuxurySubcategoriesSection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [subcategories, setSubcategories] = useState<LuxurySubcategory[]>(INITIAL_LUXURY_SUBCATEGORIES);
  const [collapsed, setCollapsed] = useState(true);
  useDirtyTracking(subcategories, onDirtyChange, resetKey);

  const updateSubcategory = (id: string, patch: Partial<LuxurySubcategory>) => {
    setSubcategories((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeSubcategory = (id: string) => {
    setSubcategories((prev) => prev.filter((item) => item.id !== id));
  };

  const addSubcategory = () => {
    setSubcategories((prev) => [...prev, { id: generateId("luxury"), name: "", visible: true }]);
    setCollapsed(false);
  };

  return (
    <AdminSectionCard
      title="精緻璽品子分類名稱"
      description={
        subcategories.length === 0
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
      {!collapsed && (
        <>
          {subcategories.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {subcategories.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-[#E0E3E8] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold leading-[1.45em] text-[#090909]">
                      子分類 {index + 1} 名稱
                    </span>
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
          )}

          <AdminAddButton label="新增子分類" onClick={addSubcategory} />
        </>
      )}
    </AdminSectionCard>
  );
}
