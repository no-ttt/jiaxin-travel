"use client";

import { useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import { INITIAL_HOMEPAGE_SEARCH_KEYWORDS } from "./data";

export default function SearchKeywordsSection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [keywords, setKeywords] = useState<string[]>(INITIAL_HOMEPAGE_SEARCH_KEYWORDS);
  useDirtyTracking(keywords, onDirtyChange, resetKey);
  const [newKeyword, setNewKeyword] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const addKeyword = () => {
    const trimmed = newKeyword.trim();
    if (!trimmed || keywords.includes(trimmed)) return;
    setKeywords((prev) => [...prev, trimmed]);
    setNewKeyword("");
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((item) => item !== keyword));
  };

  const handleDrop = (targetIndex: number, sourceIndex: number) => {
    if (sourceIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    setKeywords((prev) => {
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <AdminSectionCard
      title="熱門快搜"
      description="設定首頁「熱門快搜」區塊顯示的目的地關鍵字，使用者點擊後將直接前往該關鍵字的搜尋結果頁。"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {keywords.map((keyword, index) => (
            <span
              key={keyword}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", String(index));
                e.dataTransfer.effectAllowed = "move";
                setDragIndex(index);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIndex(index);
              }}
              onDragLeave={() => setOverIndex((current) => (current === index ? null : current))}
              onDrop={(e) => {
                e.preventDefault();
                const sourceIndex = Number(e.dataTransfer.getData("text/plain"));
                handleDrop(index, sourceIndex);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`flex h-[30px] cursor-grab items-center gap-2 rounded-full border px-3 text-[13px] font-medium leading-[1.45em] text-[#002366] transition active:cursor-grabbing ${
                overIndex === index && dragIndex !== index
                  ? "border-[#0053E0] bg-[#DBE8FF]"
                  : "border-[#E0E3E8] bg-[#ECF1FA]"
              } ${dragIndex === index ? "opacity-40" : ""}`}
            >
              <span className="select-none text-[#94A3B8]">⠿</span>
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="cursor-pointer text-sm leading-[1.45em] text-[#535F71]"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex h-[38px] items-center gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="輸入新的搜尋關鍵字…"
            className="h-[38px] w-[246px] rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#535F71] outline-none focus:border-[#0053E0]"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="flex h-[38px] w-[58px] cursor-pointer items-center justify-center rounded-lg border border-[#E0E3E8] bg-white text-[13px] font-bold leading-[1.45em] text-[#0053E0] transition hover:bg-[#ECF1FA]"
          >
            新增
          </button>
        </div>
      </div>

      <AdminInfoNote>
        每個關鍵字對應前台的一個快速搜尋標籤，使用者點擊後將直接前往該關鍵字的行程搜尋結果頁（無需另外設定連結網址）；拖曳排序可調整顯示順序，關閉後該關鍵字將不再顯示於首頁。
      </AdminInfoNote>
    </AdminSectionCard>
  );
}
