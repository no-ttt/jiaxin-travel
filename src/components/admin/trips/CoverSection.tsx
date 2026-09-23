"use client";

import { useState } from "react";
import { generateId } from "@/components/admin/ui/generateId";

type Chip = { id: string; label: string };

const INITIAL_CHIPS: Chip[] = [
  { id: generateId("chip"), label: "含稅" },
  { id: generateId("chip"), label: "無購物" },
  { id: generateId("chip"), label: "贈上網卡" },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex h-7 w-12 cursor-pointer items-center rounded-full p-0.5 transition ${
        checked ? "justify-end bg-[#2681E3]" : "justify-start bg-[#E0E3E8]"
      }`}
    >
      <span className="h-6 w-6 rounded-full bg-white shadow-[-1px_0.75px_1px_0px_rgba(0,0,0,0.05)]" />
    </button>
  );
}

export default function CoverSection({ title, description }: { title: string; description: string }) {
  const [showChips, setShowChips] = useState(true);
  const [productName, setProductName] = useState("冰島極光之旅｜追逐北境夢幻光影 10 日");
  const [productDescription, setProductDescription] = useState(
    "深入冰島南岸、黃金圈與冰河湖，以舒適節奏安排極光觀賞與自然景觀體驗。"
  );
  const [chips, setChips] = useState<Chip[]>(INITIAL_CHIPS);
  const [coverTitle, setCoverTitle] = useState("冰島極光之旅 AURORA ICELAND");
  const [days, setDays] = useState("10 天");

  const removeChip = (id: string) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
  };

  const addChip = () => {
    const label = window.prompt("輸入服務特色標籤");
    if (!label?.trim()) return;
    setChips((prev) => [...prev, { id: generateId("chip"), label: label.trim() }]);
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.45em] text-[#090909]">{title}</h2>
        <p className="text-[13px] font-medium leading-[1.45em] text-[#535F71]">{description}</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Cover main preview */}
        <div className="h-[220px] w-full overflow-hidden rounded-[10px] bg-[#E0E3E8] sm:h-[280px] lg:h-[352px]">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B1F3A] to-[#1B3A63] text-sm font-medium text-white/70">
            封面主圖預覽
          </div>
        </div>

        <div className="flex w-full items-center gap-[18px]">
          <button
            type="button"
            className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[#E0E3E8] px-5 text-sm font-medium leading-[1.4em] text-[#1A1C1E] hover:bg-[#F6F6F6]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M6.375 12.05H7.625V9.33625L8.625 10.3762L9.5 9.45L7 6.85L4.5 9.45L5.39062 10.36L6.375 9.33625V12.05ZM3.25 14C2.90625 14 2.61198 13.8727 2.36719 13.6181C2.1224 13.3635 2 13.0575 2 12.7V2.3C2 1.9425 2.1224 1.63646 2.36719 1.38187C2.61198 1.12729 2.90625 1 3.25 1H8.25L12 4.9V12.7C12 13.0575 11.8776 13.3635 11.6328 13.6181C11.388 13.8727 11.0938 14 10.75 14H3.25ZM7.625 5.55V2.3H3.25V12.7H10.75V5.55H7.625ZM3.25 2.3V5.55V12.7V2.3Z"
                fill="#1A1C1E"
              />
            </svg>
            更換圖片
          </button>
          <button
            type="button"
            className="flex h-10 w-[78px] cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-medium leading-[1.4em] text-[#CD5959] hover:bg-[#FDEDED]"
          >
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
              <path
                d="M1 3H10M4 3V1.5H7V3M4.5 5.5V9M6.5 5.5V9M1.75 3L2.25 10.5C2.28 10.9 2.62 11.25 3.02 11.25H7.98C8.38 11.25 8.72 10.9 8.75 10.5L9.25 3"
                stroke="#CD5959"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            移除
          </button>
        </div>
      </div>

      {/* Product Listing Info Settings */}
      <div className="flex flex-col gap-4 py-[18px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-bold leading-[1.45em] text-[#002366]">產品資訊</h3>
            <p className="text-[13px] leading-[1.45em] text-[#535F71]">
              用於集合頁與產品卡的名稱、說明與服務特色標籤。
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="text-sm font-medium leading-[1.45em] text-[#090909]">前台顯示服務標籤</span>
            <ToggleSwitch checked={showChips} onChange={setShowChips} />
          </div>
        </div>

        <div className="flex flex-col gap-[7px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#090909]">行程產品名稱</span>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="h-11 w-full rounded-lg border border-[#E0E3E8] bg-white px-3.5 text-sm font-medium leading-[1.45em] text-[#090909] outline-none focus:border-[#0053E0]"
          />
        </div>

        <div className="flex flex-col gap-[7px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#090909]">說明文字</span>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-[#E0E3E8] bg-white px-3.5 py-[11px] text-sm font-medium leading-[1.6em] text-[#090909] outline-none focus:border-[#0053E0]"
          />
        </div>

        {showChips && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold leading-[1.45em] text-[#090909]">服務特色標籤</span>
              <span className="text-[13px] leading-[1.45em] text-[#535F71]">最多建議 3–5 個</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <div
                  key={chip.id}
                  className="flex items-center gap-1.5 rounded-full border border-[#E0E3E8] bg-[#ECF1FA] py-[6px] pl-3 pr-2.5"
                >
                  <span className="text-[13px] font-medium leading-[1.4em] text-[#002366]">{chip.label}</span>
                  <button
                    type="button"
                    onClick={() => removeChip(chip.id)}
                    aria-label={`移除 ${chip.label}`}
                    className="cursor-pointer text-sm leading-none text-[#535F71] hover:text-[#090909]"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addChip}
                className="flex h-[30px] cursor-pointer items-center rounded-full border border-[#E0E3E8] px-3 text-[13px] font-medium leading-[1.4em] text-[#002366] hover:bg-[#ECF1FA]"
              >
                ＋ 新增 Chip
              </button>
            </div>
            <p className="text-[13px] leading-[1.5em] text-[#535F71]">
              用於含稅、無自費、導覽耳機、上網卡等服務內容；建議 3–5 個，可整組關閉。
            </p>
          </div>
        )}
      </div>

      {/* Cover Copy */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-[7px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">封面主標題</span>
          <input
            type="text"
            value={coverTitle}
            onChange={(e) => setCoverTitle(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
          />
          <p className="text-[11px] leading-[1.4em] text-[#535F71]">
            此為封面圖上顯示的大標題；SEO 頁面標題請至「02 行程基本資料」的「標題」欄位維護，前台卡片顯示名稱請見同區「行程產品名稱」。
          </p>
        </div>
        <div className="flex w-full flex-col gap-[7px] sm:w-[230px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">天數</span>
          <input
            type="text"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
          />
          <p className="text-[11px] leading-[1.4em] text-[#535F71]">
            結構化天數欄位，供前台篩選與顯示。若為自建行程並需自動產生每日行程日卡，請至「02 行程基本資料」設定基準出發／回程日期。
          </p>
        </div>
      </div>
    </section>
  );
}
