"use client";

import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import ToggleSwitch from "../ui/ToggleSwitch";
import { CATEGORY_NAME_MAX, isValidName, submenuNote, type CategoryDraft } from "./data";

const nameInputClass = (invalid: boolean) =>
  `h-11 w-full rounded-xl border bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0] ${
    invalid ? "border-[#D92D20]" : "border-[#E0E3E8]"
  }`;

function NameError({ value }: { value: string }) {
  if (isValidName(value, CATEGORY_NAME_MAX)) return null;
  return (
    <p className="text-xs leading-[1.45em] text-[#D92D20]">名稱必填，最多 {CATEGORY_NAME_MAX} 字</p>
  );
}

export default function SidebarCategoriesSection({
  value: categories,
  onChange,
}: {
  value: CategoryDraft[];
  onChange: (updater: (prev: CategoryDraft[]) => CategoryDraft[]) => void;
}) {
  const updateCategory = (id: number, patch: Partial<CategoryDraft>) => {
    onChange((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...patch } : cat)));
  };

  const submenuCategories = categories.filter((cat) => cat.hasSubmenu);
  const fixedCategories = categories.filter((cat) => !cat.hasSubmenu);

  return (
    <AdminSectionCard
      title="側邊欄大分類名稱"
      description={`管理首頁側邊欄由上到下的 ${categories.length} 個大分類顯示名稱。其中「國外團體」「主題旅遊」「精緻璽品」可開關子選單——開啟時子分類請於對應區塊編輯，關閉時導向所設定的頁面網址；其餘 ${fixedCategories.length} 個分類固定為導向頁面網址，無子選單。`}
    >
      <p className="text-[13px] leading-[1.5em] text-[#535F71]">
        以下 {categories.length} 個欄位由上到下對應首頁側邊欄的大分類；每個分類的圖示與排序暫不開放後台調整，僅可編輯顯示名稱。
      </p>

      <div className="flex flex-col gap-5">
        {submenuCategories.map((cat) => {
          const index = categories.findIndex((c) => c.id === cat.id);
          const notes = submenuNote(cat.key);
          return (
            <div key={cat.id} className="flex flex-col gap-[7px]">
              <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">分類 {index + 1} 名稱</span>
              <input
                type="text"
                value={cat.displayName}
                maxLength={CATEGORY_NAME_MAX}
                onChange={(e) => updateCategory(cat.id, { displayName: e.target.value })}
                className={nameInputClass(!isValidName(cat.displayName, CATEGORY_NAME_MAX))}
              />
              <NameError value={cat.displayName} />
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-medium leading-[1.45em] text-[#002366]">子選單</span>
                <ToggleSwitch
                  checked={cat.submenuEnabled}
                  onChange={() => updateCategory(cat.id, { submenuEnabled: !cat.submenuEnabled })}
                  label={`切換${cat.displayName}子選單`}
                />
                {cat.submenuEnabled ? (
                  <p className="text-xs leading-[1.45em] text-[#0053E0]">{notes.enabled}</p>
                ) : (
                  <>
                    <input
                      type="text"
                      value={cat.redirectUrl}
                      onChange={(e) => updateCategory(cat.id, { redirectUrl: e.target.value })}
                      placeholder="導向網址（子選單關閉時使用，選填）"
                      className="h-8 w-[430px] rounded-lg border border-[#E0E3E8] bg-white px-3 text-xs leading-[1.45em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                    />
                    <p className="text-xs leading-[1.45em] text-[#0053E0]">{notes.disabled}</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fixedCategories.map((cat) => {
          const index = categories.findIndex((c) => c.id === cat.id);
          return (
            <div key={cat.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-[7px]">
                <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">分類 {index + 1} 名稱</span>
                <input
                  type="text"
                  value={cat.displayName}
                  maxLength={CATEGORY_NAME_MAX}
                  onChange={(e) => updateCategory(cat.id, { displayName: e.target.value })}
                  className={nameInputClass(!isValidName(cat.displayName, CATEGORY_NAME_MAX))}
                />
                <NameError value={cat.displayName} />
              </div>
              <div className="flex flex-col gap-[7px]">
                <span className="text-sm font-bold leading-[1.45em] text-[#090909]">導向頁面網址</span>
                <input
                  type="text"
                  value={cat.redirectUrl}
                  onChange={(e) => updateCategory(cat.id, { redirectUrl: e.target.value })}
                  placeholder="導向網址（站內／外部皆可，選填）"
                  className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#535F71] outline-none focus:border-[#0053E0]"
                />
              </div>
            </div>
          );
        })}
      </div>

      <AdminInfoNote>
        以上為側邊欄全部 {categories.length} 個大分類；圖示與排序暫不開放後台調整。僅「國外團體」「主題旅遊」「精緻璽品」3
        項具備子選單開關，其餘 {fixedCategories.length} 項（客製包團、美安專區、機票、簽證、旅客服務、旅程分享）恆為導向頁面網址，網址可填站內頁面路徑，也可填外部網站連結。
      </AdminInfoNote>
    </AdminSectionCard>
  );
}
