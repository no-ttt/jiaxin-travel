"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/ui/Dropdown";

const SLIDES = [
  {
    id: "banner-1",
    image: "/images/banner-1.png",
    title: "無限延展的地平線，最完美的出發。",
    subtitle: "專為追求完美的您，打造每一場獨一無二的奢華回憶。",
  },
  {
    id: "banner-2",
    image: "/images/banner-2.png",
    title: "秋季線上旅展，限時優惠中。",
    subtitle: "2026.07.10（五）- 08.09（日），精選歐洲、土耳其行程一次搶購。",
  },
  {
    id: "banner-3",
    image: "/images/banner-3.png",
    title: "卡帕多奇亞的熱氣球，等你來搭乘。",
    subtitle: "專為追求完美的您，打造每一場獨一無二的奢華回憶。",
  },
];

const AUTOPLAY_INTERVAL = 6000;
const TAB_TRANSITION_DURATION = 400;

type SearchTab = {
  id: string;
  label: string;
  kind: "search" | "service";
};

const TABS: SearchTab[] = [
  { id: "group", label: "國外團體", kind: "search" },
  { id: "boutique", label: "精緻璽品", kind: "search" },
  { id: "theme", label: "主題旅遊", kind: "search" },
  { id: "custom", label: "客製包團", kind: "service" },
  { id: "flight", label: "機票", kind: "service" },
  { id: "visa", label: "簽證", kind: "service" },
];

const THEME_CATEGORIES = ["賞楓行程", "親子旅遊", "蜜月旅行", "美食饗宴", "自然探索"];

const SERVICE_CONTENT: Record<
  string,
  { icon: string; title: string; description: string; cta: string; href: string }
> = {
  custom: {
    icon: "/images/service-custom-icon.png",
    title: "專屬量身打造，不限人數、彈性成行！",
    description: "提供專屬行程規劃服務，由旅遊顧問協助安排交通、住宿與行程。",
    cta: "前往客製包團與需求填寫 →",
    href: "/custom-trip",
  },
  flight: {
    icon: "/images/service-flight-icon.png",
    title: "即時查詢全球航班與優惠票價",
    description: "即將前往合作機票預訂系統，可查詢即時航班與票價資訊。",
    cta: "立即查詢全球機票 ↗",
    href: "/contact",
  },
  visa: {
    icon: "/images/service-visa-icon.png",
    title: "護照及簽證代辦服務",
    description: "提供各國簽證與護照代辦說明、所需準備文件、辦理流程及費用查詢。",
    cta: "查看護照與簽證代辦服務 →",
    href: "/contact",
  },
};

export default function Banner() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const [pendingTabId, setPendingTabId] = useState<string | null>(null);

  const activeTab = TABS.find((tab) => tab.id === activeTabId) ?? TABS[0];
  const pendingTab = pendingTabId ? TABS.find((tab) => tab.id === pendingTabId) : null;
  const isKindChange = pendingTab ? pendingTab.kind !== activeTab.kind : false;

  const handleTabClick = useCallback(
    (tabId: string) => {
      if (tabId === activeTabId || pendingTabId) return;
      setPendingTabId(tabId);
      setTimeout(() => {
        setActiveTabId(tabId);
        setPendingTabId(null);
      }, TAB_TRANSITION_DURATION);
    },
    [activeTabId, pendingTabId]
  );

  const goToPrev = useCallback(() => {
    setActiveIndex((index) => (index - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [goToNext, activeIndex]);

  return (
    <section className="relative">
      <div className="relative h-[520px] w-full overflow-hidden sm:h-[560px] lg:h-[640px]">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            aria-hidden={index !== activeIndex}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(15,28,54,0.55)] via-[rgba(15,28,54,0.25)] to-transparent" />
            <div className="absolute inset-x-0 bottom-32 px-6 sm:bottom-28 sm:px-12 lg:bottom-36 lg:px-[170px]">
              <div className="max-w-[840px]">
                <h1 className="font-serif text-2xl font-bold leading-[1.45] tracking-[-0.023em] text-white sm:text-4xl lg:text-[52px]">
                  {slide.title}
                </h1>
                <p className="mt-3 max-w-[620px] text-sm text-white/95 sm:text-base lg:text-lg">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={goToPrev}
          aria-label="上一張"
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white sm:left-8"
        >
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M22 14L16 20L22 26" stroke="#042B7B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goToNext}
          aria-label="下一張"
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white sm:right-8"
        >
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M18 14L24 20L18 26" stroke="#042B7B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`前往第 ${index + 1} 張輪播圖`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 cursor-pointer rounded-full transition-all ${
                index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-4 -mt-8 rounded-3xl bg-white shadow-[0px_12px_40px_-12px_rgba(24,72,150,0.1)] sm:mx-8 sm:-mt-14 lg:mx-[120px] lg:-mt-14">
        <div className="flex flex-wrap items-center justify-center rounded-t-3xl border-b border-slate-200 bg-slate-50">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`cursor-pointer whitespace-nowrap px-4 py-3 text-sm font-medium tracking-[0.0938em] sm:px-8 sm:py-4 sm:text-base ${
                  isActive
                    ? "border-b-[3px] border-[#0053E0] bg-[#ECF1FA] font-bold text-[#002366]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          className={`transition-opacity duration-[400ms] ease-in-out ${
            isKindChange ? "opacity-0" : "opacity-100"
          }`}
        >
          {activeTab.kind === "search" ? (
            <SearchPanel
              keywordVariant={activeTab.id}
              isKeywordFading={Boolean(pendingTab) && !isKindChange}
              onSearch={() => router.push("/search")}
            />
          ) : (
            <ServicePanel {...SERVICE_CONTENT[activeTab.id]} />
          )}
        </div>
      </div>
    </section>
  );
}

function SearchPanel({
  keywordVariant,
  isKeywordFading,
  onSearch,
}: {
  keywordVariant: string;
  isKeywordFading: boolean;
  onSearch: () => void;
}) {
  return (
    <div className="flex flex-col gap-8 rounded-b-3xl px-6 py-8 sm:px-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SearchField label="地區／目的地" placeholder="輸入目的地（國家、地區或城市）" />
          <div
            className={`transition-opacity duration-[400ms] ease-in-out ${
              isKeywordFading ? "opacity-0" : "opacity-100"
            }`}
          >
            {keywordVariant === "theme" ? (
              <ThemeDropdownField />
            ) : keywordVariant === "boutique" ? (
              <SearchField label="關鍵字" placeholder="精緻璽品" disabled />
            ) : (
              <SearchField label="關鍵字" placeholder="輸入目的地（國家、地區或城市）" />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <SearchField label="出發日期" placeholder="輸入目的地（國家、地區或城市）" type="date" />
          <SearchField label="結束日期" placeholder="輸入目的地（國家、地區或城市）" type="date" />
        </div>
      </div>

      <button
        type="button"
        onClick={onSearch}
        className="flex h-12 cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#0053E0] text-lg font-bold uppercase tracking-wide text-white transition hover:bg-[#0044b8]"
      >
        <Image src="/images/search-icon.svg" alt="" width={24} height={24} />
        搜尋行程
      </button>
    </div>
  );
}

function ServicePanel({
  icon,
  title,
  description,
  cta,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-b-3xl px-6 py-8 sm:px-12">
      <div className="flex w-full items-center gap-4 pl-0 sm:gap-6 sm:pl-6">
        <Image
          src={icon}
          alt=""
          width={80}
          height={80}
          className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
        />
        <div className="flex flex-col gap-2">
          <p className="text-base font-bold leading-snug text-[#002366] sm:text-lg">{title}</p>
          <p className="text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push(href)}
        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] px-6 text-base font-bold text-white transition hover:bg-[#0044b8]"
      >
        {cta}
      </button>
    </div>
  );
}

function ThemeDropdownField() {
  const [category, setCategory] = useState("");

  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-sm font-medium uppercase tracking-wide text-slate-600 sm:w-28">
        關鍵字
      </span>
      <div className="min-w-0 flex-1">
        <Dropdown
          placeholder="選擇主題分類"
          options={THEME_CATEGORIES}
          value={category}
          onChange={setCategory}
        />
      </div>
    </div>
  );
}

function SearchField({
  label,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  placeholder: string;
  type?: "text" | "date";
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-sm font-medium uppercase tracking-wide text-slate-600 sm:w-28">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`min-w-0 flex-1 rounded-[10px] border px-4 py-3 text-sm focus:outline-none ${
          disabled
            ? "cursor-not-allowed border-[#D9DADD] bg-[#EAEBED] text-[#94969C] placeholder:text-[#94969C]"
            : "border-slate-200 bg-slate-50 text-slate-700 placeholder:text-[#888888] focus:border-[#0053E0]"
        }`}
      />
    </div>
  );
}
