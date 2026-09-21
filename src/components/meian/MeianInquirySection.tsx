"use client";

import { useState } from "react";
import CustomTripForm from "@/components/custom-trip/CustomTripForm";

export default function MeianInquirySection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-stretch bg-[#FAFAFA]">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center gap-4 px-6 py-6 sm:px-[160px]"
      >
        <div className="flex flex-1 flex-col gap-2 text-left">
          <span className="text-xs font-semibold tracking-[0.1833em] text-[#0053E0]">
            EXCLUSIVE TRIP INQUIRY
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#090909] sm:text-[34px]">
            美安客製包團需求單
          </h2>
          <p className="text-sm leading-[1.6] text-[#535F71] sm:text-[15px]">
            請留下您的聯絡方式，我們將盡快為您安排行程諮詢。
          </p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              d="M4.5 7L9 11.5L13.5 7"
              stroke="#535F71"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && <CustomTripForm showHeading={false} />}
    </div>
  );
}
