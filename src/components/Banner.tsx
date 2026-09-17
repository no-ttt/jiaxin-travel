"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

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

const TABS = ["國外團體", "精緻璽品", "主題旅遊", "客製包團", "機票", "簽證"];

const AUTOPLAY_INTERVAL = 6000;

export default function Banner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(TABS[0]);

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
                <h1 className="font-serif text-2xl font-bold leading-[1.45] text-white sm:text-4xl lg:text-[52px]">
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
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer whitespace-nowrap px-4 py-3 text-sm font-medium tracking-wide sm:px-8 sm:py-4 sm:text-base ${
                  isActive
                    ? "border-b-[3px] border-[#0053E0] bg-[#ECF1FA] font-bold text-[#002366]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-8 rounded-b-3xl px-6 py-8 sm:px-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <SearchField label="地區／目的地" placeholder="輸入目的地（國家、地區或城市）" />
              <SearchField label="關鍵字" placeholder="輸入目的地（國家、地區或城市）" />
            </div>
            <div className="flex flex-col gap-4">
              <SearchField label="出發日期" placeholder="輸入目的地（國家、地區或城市）" type="date" />
              <SearchField label="結束日期" placeholder="輸入目的地（國家、地區或城市）" type="date" />
            </div>
          </div>

          <button
            type="button"
            className="flex h-12 cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#0053E0] text-lg font-bold uppercase tracking-wide text-white transition hover:bg-[#0044b8]"
          >
            <Image src="/images/search-icon.svg" alt="" width={24} height={24} />
            搜尋行程
          </button>
        </div>
      </div>
    </section>
  );
}

function SearchField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: "text" | "date";
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-sm font-medium uppercase tracking-wide text-slate-600 sm:w-28">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-[#888888] focus:border-[#0053E0] focus:outline-none"
      />
    </div>
  );
}
