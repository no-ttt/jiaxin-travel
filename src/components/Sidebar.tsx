"use client";

import { useEffect, useRef, useState } from "react";

type NavItem = {
  label: string;
  href?: string;
  overlay?: { title: string; options: string[] };
};

const OUTBOUND_GROUP_OPTIONS = [
  "日本", "韓國", "中國大陸", "香港/澳門",
  "泰國", "馬來西亞/新加坡", "越南", "印尼",
  "菲律賓", "吳哥窟", "澳洲", "紐西蘭",
  "中亞/南亞", "土耳其/中東", "非洲", "美國",
  "加拿大", "中南美/南極", "關島/帛琉", "中西歐",
  "東歐/巴爾幹半島", "南/北歐",
];

const THEME_OPTIONS = [
  "賽車", "郵輪", "鐵道", "山林",
  "滑雪", "馬拉松", "單車", "登山健行",
  "高爾夫",
];

const NAV_ITEMS: NavItem[] = [
  { label: "國外團體", overlay: { title: "國外團體", options: OUTBOUND_GROUP_OPTIONS } },
  { label: "主題旅遊", overlay: { title: "主題旅遊", options: THEME_OPTIONS } },
  { label: "客製包團", href: "#" },
  { label: "美安專區", href: "#" },
  { label: "機票", href: "#" },
  { label: "簽證", href: "#" },
  { label: "旅客服務", href: "#" },
  { label: "旅程分享", href: "#" },
];

const CLOSE_DELAY_MS = 200;

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setHoveredLabel(null);
      setExpandedLabel(null);
    }
  }, [isOpen]);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = (label: string) => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setHoveredLabel((current) => (current === label ? null : current));
    }, CLOSE_DELAY_MS);
  };

  return (
    <nav
      aria-hidden={!isOpen}
      className={`fixed left-0 top-[var(--header-height)] z-40 flex max-h-[calc(100vh-var(--header-height))] w-[85vw] max-w-[280px] flex-col gap-1 overflow-y-auto border border-l-0 border-slate-200 bg-white p-3 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.04),0px_10px_24px_-10px_rgba(0,0,0,0.03)] transition-transform duration-300 md:max-h-none md:w-[280px] md:overflow-visible ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {NAV_ITEMS.map((item) => {
        const isHovered = hoveredLabel === item.label;
        const isExpanded = expandedLabel === item.label;
        const isActive = (isHovered || isExpanded) && item.overlay;

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => {
              cancelClose();
              setHoveredLabel(item.label);
            }}
            onMouseLeave={() => scheduleClose(item.label)}
          >
            <a
              href={item.overlay ? undefined : (item.href ?? "#")}
              onClick={(event) => {
                if (!item.overlay) return;
                event.preventDefault();
                setExpandedLabel((current) => (current === item.label ? null : item.label));
              }}
              className={`flex h-20 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base font-medium transition-colors ${
                isActive
                  ? "border-[#0053E0] bg-[#ECF1FA] text-[#090909]"
                  : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </a>

            {item.overlay && (
              <>
                {/* Desktop: hover flyout */}
                {isHovered && (
                  <div className="absolute left-full top-0 z-20 ml-6 hidden w-max rounded-[18px] border border-slate-200 bg-white p-8 shadow-[0px_12px_34px_-6px_rgba(5,18,36,0.12)] md:block">
                    <h3 className="mb-6 text-xl font-bold text-[#090909]">{item.overlay.title}</h3>
                    <div className="grid grid-cols-4 gap-x-16 gap-y-6">
                      {item.overlay.options.map((option) => (
                        <a
                          key={option}
                          href="#"
                          className="flex cursor-pointer items-center rounded-lg border border-transparent px-3 py-2.5 text-base text-[#090909] transition-colors duration-150 hover:border-slate-200 hover:bg-slate-50 hover:text-[#0053E0]"
                        >
                          {option}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile: inline accordion */}
                {isExpanded && (
                  <div className="mb-1 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 md:hidden">
                    {item.overlay.options.map((option) => (
                      <a
                        key={option}
                        href="#"
                        className="flex cursor-pointer items-center rounded-lg border border-transparent px-3 py-2.5 text-sm text-[#090909] transition-colors duration-150 hover:border-slate-200 hover:bg-white hover:text-[#0053E0]"
                      >
                        {option}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
