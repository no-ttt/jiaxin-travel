"use client";

import { TERMS_TABS, type TermsTabId } from "./data";

type TermsTabsProps = {
  activeTab: TermsTabId;
  onChange: (tab: TermsTabId) => void;
};

export default function TermsTabs({ activeTab, onChange }: TermsTabsProps) {
  return (
    <div className="sticky top-0 z-30 flex w-full justify-center border-y border-[#E0E3E8] bg-white shadow-[0px_8px_24px_0px_rgba(5,20,41,0.08)]">
      <div className="flex w-full max-w-[1200px] gap-2 overflow-x-auto px-4 sm:px-8 lg:gap-0 lg:overflow-visible lg:px-0">
        {TERMS_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex shrink-0 cursor-pointer flex-col items-center gap-2 whitespace-nowrap px-4 py-6 text-[15px] transition-colors sm:px-5 ${
                isActive ? "font-bold text-[#0053E0]" : "font-medium text-[#535F71] hover:text-[#0053E0]"
              }`}
            >
              {tab.label}
              <span
                className={`h-[3px] w-16 rounded-full transition-colors ${
                  isActive ? "bg-[#0053E0]" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
