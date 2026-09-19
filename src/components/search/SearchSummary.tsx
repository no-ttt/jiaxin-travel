"use client";

import { useState } from "react";

export type SortOption = "popular" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  popular: "熱門程度",
  "price-asc": "價格由低到高",
  "price-desc": "價格由高到低",
};

export default function SearchSummary({
  destination,
  resultCount,
  activeFilters,
  onRemoveFilter,
  sort,
  onSortChange,
}: {
  destination: string;
  resultCount: number;
  activeFilters: string[];
  onRemoveFilter: (filter: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold text-[#090909]">搜尋結果：{destination}</h1>
        <p className="text-sm text-[#535F71]">共找到 {resultCount} 個符合條件的行程</p>
      </div>

      <div className="flex flex-col items-end gap-3">
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter}
                className="flex h-[30px] items-center gap-2 rounded-full border border-[#E0E3E8] bg-[#ECF1FA] px-3"
              >
                <span className="text-xs font-medium text-[#002366]">{filter}</span>
                <button
                  type="button"
                  aria-label={`移除 ${filter}`}
                  onClick={() => onRemoveFilter(filter)}
                  className="cursor-pointer text-sm text-[#535F71] hover:text-[#0053E0]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex h-10 items-center gap-2">
          <span className="text-[13px] font-medium text-[#535F71]">排序</span>
          <button
            type="button"
            onClick={() => setSortOpen((open) => !open)}
            aria-expanded={sortOpen}
            className="flex h-10 w-36 cursor-pointer items-center justify-between rounded-[10px] border border-[#E0E3E8] bg-white px-[13px] text-sm text-[#090909]"
          >
            {SORT_LABELS[sort]}
            <span className="text-[#535F71]">⌄</span>
          </button>

          {sortOpen && (
            <>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setSortOpen(false)}
              />
              <div className="absolute right-0 top-11 z-20 w-36 overflow-hidden rounded-[10px] border border-[#E0E3E8] bg-white shadow-[0px_8px_24px_0px_rgba(5,20,41,0.08)]">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onSortChange(option);
                      setSortOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center px-3 py-2.5 text-left text-sm hover:bg-[#F3F3F6] ${
                      option === sort ? "text-[#0053E0]" : "text-[#090909]"
                    }`}
                  >
                    {SORT_LABELS[option]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
