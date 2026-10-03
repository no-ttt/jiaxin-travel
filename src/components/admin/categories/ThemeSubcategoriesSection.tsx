"use client";

import { useState } from "react";
import Link from "next/link";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import ToggleSwitch from "../ui/ToggleSwitch";
import { SUBCATEGORY_NAME_MAX, duplicateNames, isDuplicate, isValidName, newTheme, type ThemeDraft } from "./data";

export default function ThemeSubcategoriesSection({
  value: themes,
  onChange,
}: {
  value: ThemeDraft[];
  onChange: (updater: (prev: ThemeDraft[]) => ThemeDraft[]) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const updateTheme = (key: string, patch: Partial<ThemeDraft>) => {
    onChange((prev) => prev.map((theme) => (theme.key === key ? { ...theme, ...patch } : theme)));
  };

  const addTheme = () => {
    onChange((prev) => [...prev, newTheme(prev)]);
  };

  // Only rows that were never saved can be dropped; deleting a saved theme also deletes its collection page.
  const removeUnsavedTheme = (key: string) => {
    onChange((prev) => prev.filter((theme) => theme.key !== key));
  };

  const duplicates = duplicateNames(themes);

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
              以下欄位對應「主題旅遊」展開選單中的子類別，依畫面上由左到右、由上到下排列。可透過「顯示於前台」開關暫時隱藏目前沒有行程的子類別，或點擊右側「＋新增子類別」新增新的子類別；儲存後系統會自動建立對應的主題集合頁。
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
            {themes.map((theme, index) => {
              const duplicated = isDuplicate(duplicates, theme.name);
              const invalid = !isValidName(theme.name, SUBCATEGORY_NAME_MAX) || duplicated;
              return (
                <div
                  key={theme.key}
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
                        onChange={() => updateTheme(theme.key, { visible: !theme.visible })}
                        label={`切換${theme.name || "子類別"}顯示`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={theme.name}
                      maxLength={SUBCATEGORY_NAME_MAX}
                      onChange={(e) => updateTheme(theme.key, { name: e.target.value })}
                      onBlur={() => theme.name !== theme.name.trim() && updateTheme(theme.key, { name: theme.name.trim() })}
                      className={`h-11 w-full rounded-xl border bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0] ${
                        invalid ? "border-[#D92D20]" : "border-[#E0E3E8]"
                      }`}
                    />
                    {theme.id == null && (
                      <button
                        type="button"
                        onClick={() => removeUnsavedTheme(theme.key)}
                        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] text-sm text-[#535F71] transition hover:border-[#0053E0] hover:bg-[#ECF1FA]"
                        aria-label="移除未儲存的子類別"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {invalid && (
                    <p className="text-xs leading-[1.45em] text-[#D92D20]">
                      {duplicated ? "名稱重複，請改用其他名稱" : `名稱必填，最多 ${SUBCATEGORY_NAME_MAX} 字`}
                    </p>
                  )}

                  <div className="flex flex-col gap-[7px]">
                    <span className="text-sm font-bold leading-[1.45em] text-[#090909]">對應主題集合頁</span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-[#ECF1FA] px-2.5 py-1.5 text-xs font-medium leading-[1.45em] text-[#090909]">
                        《{theme.name || "未命名"}》主題集合頁
                      </span>
                      {theme.collectionId != null ? (
                        <Link
                          href={`/admin/dashboard/categories/theme/${theme.collectionId}`}
                          className="cursor-pointer text-xs font-medium leading-[1.45em] text-[#0053E0]"
                        >
                          前往編輯內容 →
                        </Link>
                      ) : (
                        <span className="text-xs font-medium leading-[1.45em] text-[#535F71]">
                          儲存後可編輯內容
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <AdminInfoNote>
            排列順序暫不開放後台調整。「顯示於前台」關閉時，該子類別不會出現在前台選單中，其主題集合頁也不對外開放；新增的子類別儲存後，即可點「前往編輯內容」設定其主題集合頁。已儲存的子類別暫不提供刪除。
          </AdminInfoNote>
        </>
      )}
    </AdminSectionCard>
  );
}
