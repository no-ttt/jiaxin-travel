"use client";

import { useState } from "react";

/** 「溫泉」「 溫泉 」「ｏｎｓｅｎ」/「onsen」 count as the same keyword. */
const normalizeKeyword = (keyword: string) => keyword.normalize("NFKC").replace(/\s+/g, "").toLowerCase();

/** 關鍵字 tag input: Enter or「＋ 新增」adds the typed keyword, × on a tag removes it. */
export default function KeywordTagInput({
  value,
  onChange,
  onDuplicate,
}: {
  value: string[];
  onChange: (keywords: string[]) => void;
  /** Called with the existing keyword when the typed one is already in the list. */
  onDuplicate: (existing: string) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const keyword = draft.trim();
    if (!keyword) return;
    const existing = value.find((item) => normalizeKeyword(item) === normalizeKeyword(keyword));
    if (existing) {
      onDuplicate(existing);
      return;
    }
    onChange([...value, keyword]);
    setDraft("");
  };

  return (
    <div className="flex gap-2">
      <div className="flex min-h-[38px] flex-1 flex-wrap items-center gap-2 rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-3 py-0.5 focus-within:border-[#0053E0]">
        {value.map((keyword) => (
          <span
            key={keyword}
            className="flex items-center gap-1.5 rounded-md border border-[#E0E3E8] bg-white px-2.5 py-1 text-[15px] leading-[1.45em] text-[#303744]"
          >
            {keyword}
            <button
              type="button"
              onClick={() => onChange(value.filter((item) => item !== keyword))}
              aria-label={`移除 ${keyword}`}
              className="cursor-pointer leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Ignore the Enter that confirms an IME (注音/拼音) composition.
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault();
              add();
            }
          }}
          placeholder="輸入關鍵字"
          className="h-8 min-w-[120px] flex-1 bg-transparent text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none placeholder:text-[#535F71]"
        />
      </div>
      <button
        type="button"
        onClick={add}
        className="flex h-[38px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#E0E3E8] bg-white px-4 text-[13px] font-bold leading-[1.45em] text-[#0053E0] transition hover:bg-[#ECF1FA]"
      >
        ＋ 新增
      </button>
    </div>
  );
}
