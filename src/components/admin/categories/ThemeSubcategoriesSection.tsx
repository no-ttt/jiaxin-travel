"use client";

import { useState } from "react";
import Link from "next/link";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import ToggleSwitch from "../ui/ToggleSwitch";
import { generateId } from "../ui/generateId";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import { INITIAL_THEME_SUBCATEGORIES, type ThemeSubcategory } from "./data";

export default function ThemeSubcategoriesSection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [themes, setThemes] = useState<ThemeSubcategory[]>(INITIAL_THEME_SUBCATEGORIES);
  const [collapsed, setCollapsed] = useState(false);
  useDirtyTracking(themes, onDirtyChange, resetKey);

  const updateTheme = (id: string, patch: Partial<ThemeSubcategory>) => {
    setThemes((prev) => prev.map((theme) => (theme.id === id ? { ...theme, ...patch } : theme)));
  };

  const addTheme = () => {
    setThemes((prev) => [
      ...prev,
      { id: generateId("theme"), name: "", visible: true, pageLabel: "" },
    ]);
  };

  return (
    <AdminSectionCard
      title="主題旅遊子類別名稱"
      description="管理「主題旅遊」展開選單中的子類別顯示名稱。每個子類別可個別開關「顯示於前台」——若目前沒有該類別的行程，可先關閉暫時隱藏；也可點擊「＋新增子類別」建立新的子類別。點擊子類別會進入對應的專屬「主題集合頁」管理內容。"
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
              以下欄位對應「主題旅遊」展開選單中的子類別，依畫面上由左到右、由上到下排列。可透過「顯示於前台」開關暫時隱藏目前沒有行程的子類別（如下方「單車」示意為已隱藏），或點擊右側「＋新增子類別」新增新的子類別及其對應的主題集合頁。
            </p>
            <button
              type="button"
              onClick={addTheme}
              className="shrink-0 cursor-pointer text-sm font-medium leading-[1.45em] text-[#0053E0]"
            >
              ＋ 新增子類別
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme, index) => (
              <div
                key={theme.id}
                className={`flex flex-col gap-[7px] rounded-xl border border-[#E0E3E8] p-4 ${
                  theme.visible ? "" : "opacity-55"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex-1 text-sm font-bold leading-[1.45em] text-[#090909]">
                    子類別 {index + 1} 名稱
                  </span>
                  {!theme.visible && (
                    <span className="text-[11px] font-medium leading-[1.45em] text-[#535F71]">
                      （已隱藏，暫不顯示於前台選單）
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs leading-[1.45em] text-[#535F71]">顯示於前台</span>
                    <ToggleSwitch
                      size="sm"
                      checked={theme.visible}
                      onChange={() => updateTheme(theme.id, { visible: !theme.visible })}
                      label={`切換${theme.name || "子類別"}顯示`}
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={theme.name}
                  onChange={(e) => updateTheme(theme.id, { name: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                />

                <div className="flex flex-col gap-[7px]">
                  <span className="text-sm font-bold leading-[1.45em] text-[#090909]">對應主題集合頁</span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-[#ECF1FA] px-2.5 py-1.5 text-xs font-medium leading-[1.45em] text-[#090909]">
                      {theme.pageLabel || `《${theme.name || "未命名"}》主題集合頁`}
                    </span>
                    <Link
                      href={`/admin/dashboard/categories/theme/${theme.id}`}
                      className="cursor-pointer text-xs font-medium leading-[1.45em] text-[#0053E0]"
                    >
                      前往編輯內容 →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <AdminInfoNote>
            以上為主題旅遊子類別選單示意內容；排列順序暫不開放後台調整。「顯示於前台」關閉時，該子類別不會出現在前台選單中（如「單車」示意）；新增子類別時，請一併設定其對應的主題集合頁。
          </AdminInfoNote>
        </>
      )}
    </AdminSectionCard>
  );
}
