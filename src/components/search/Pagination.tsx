"use client";

import { useState } from "react";

export default function Pagination({ pageCount }: { pageCount: number }) {
  const [page, setPage] = useState(1);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        type="button"
        aria-label="上一頁"
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] border border-[#E5E5EB] text-sm text-[#CCCFD6] disabled:cursor-not-allowed"
      >
        ‹
      </button>
      {Array.from({ length: pageCount }).map((_, i) => {
        const num = i + 1;
        const isActive = num === page;
        return (
          <button
            key={num}
            type="button"
            onClick={() => setPage(num)}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] border text-sm ${
              isActive
                ? "border-[#0053E0] bg-[#0053E0] text-white"
                : "border-[#C3C6D6] bg-white text-[#535F71]"
            }`}
          >
            {num}
          </button>
        );
      })}
      <button
        type="button"
        aria-label="下一頁"
        disabled={page === pageCount}
        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] border border-[#C3C6D6] bg-white text-sm text-[#535F71] disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
}
