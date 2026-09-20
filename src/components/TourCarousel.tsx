"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type Tour = {
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
};

function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_4px_16px_0px_rgba(8,28,58,0.12)]">
      <div className="relative h-[180px] w-full sm:h-[256px]">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <h3 className="text-lg font-medium text-[#1A1C1E]">{tour.title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-[#5B6574]">{tour.description}</p>
        <div className="flex items-center justify-between border-t border-[#C3C6D6] pt-3">
          <div className="flex items-end gap-1">
            <span className="text-[13px] text-[#002366]">TWD </span>
            <span className="text-2xl font-semibold text-[#0053E0]">{tour.price}</span>
            <span className="text-[13px] text-[#002366]">元起</span>
          </div>
          <Link
            href={`/search/${tour.id}`}
            className="flex cursor-pointer items-center gap-1 text-[13px] font-medium text-[#002366]"
          >
            詳情
            <Image src="/images/detail-arrow-icon.svg" alt="" width={5} height={8} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function useCardsPerPage() {
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const mdQuery = window.matchMedia("(min-width: 640px)");
    const lgQuery = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      setCardsPerPage(lgQuery.matches ? 3 : mdQuery.matches ? 2 : 1);
    };

    update();
    mdQuery.addEventListener("change", update);
    lgQuery.addEventListener("change", update);
    return () => {
      mdQuery.removeEventListener("change", update);
      lgQuery.removeEventListener("change", update);
    };
  }, []);

  return cardsPerPage;
}

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

export default function TourCarousel({
  eyebrow,
  title,
  tours,
  moreHref,
}: {
  eyebrow: string;
  title: string;
  tours: Tour[];
  moreHref?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const cardsPerPage = useCardsPerPage();
  const pages = chunk(tours, cardsPerPage);
  const pageCount = pages.length;

  useEffect(() => {
    setActivePage(0);
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [cardsPerPage]);

  const getPageEl = (scroller: HTMLDivElement, index: number) =>
    scroller.querySelector<HTMLElement>(`[data-page="${index}"]`);

  const scrollToPage = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const target = Math.min(pageCount - 1, Math.max(0, activePage + direction));
    const pageEl = getPageEl(scroller, target);
    if (!pageEl) return;
    scroller.scrollTo({ left: pageEl.offsetLeft, behavior: "smooth" });
  };

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let closest = 0;
    let closestDistance = Infinity;
    for (let i = 0; i < pageCount; i++) {
      const pageEl = getPageEl(scroller, i);
      if (!pageEl) continue;
      const distance = Math.abs(pageEl.offsetLeft - scroller.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    }
    setActivePage(Math.min(pageCount - 1, closest));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full items-end gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#0053E0]">
            {eyebrow}
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1A1C1E] sm:text-[32px]">{title}</h2>
        </div>
        {moreHref && (
          <Link
            href={moreHref}
            className="hidden h-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] px-[18px] text-sm font-medium text-[#002366] transition hover:bg-slate-50 sm:flex"
          >
            查看更多
          </Link>
        )}
      </div>

      <div className="relative w-full">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth px-4 pb-8 pt-2 [scrollbar-width:none] [scroll-padding-left:1rem] [&::-webkit-scrollbar]:hidden"
        >
          {pages.map((page, i) => (
            <div
              key={i}
              data-page={i}
              className="flex w-full shrink-0 snap-start gap-6"
              style={i > 0 ? { marginLeft: "3rem" } : undefined}
            >
              {page.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ))}
        </div>

        {activePage > 0 && (
          <button
            type="button"
            onClick={() => scrollToPage(-1)}
            aria-label="上一頁"
            className="absolute left-4 top-[calc(50%-16px)] z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#C3C6D6] bg-white shadow-[0px_4px_12px_0px_rgba(8,28,58,0.07)] transition hover:shadow-[0px_6px_16px_0px_rgba(8,28,58,0.15)] sm:flex"
          >
            <Image
              src="/images/chevron-right-icon.svg"
              alt=""
              width={20}
              height={20}
              className="rotate-180"
            />
          </button>
        )}

        {activePage < pageCount - 1 && (
          <button
            type="button"
            onClick={() => scrollToPage(1)}
            aria-label="下一頁"
            className="absolute right-4 top-[calc(50%-16px)] hidden h-12 w-12 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-[#C3C6D6] bg-white shadow-[0px_4px_12px_0px_rgba(8,28,58,0.07)] transition hover:shadow-[0px_6px_16px_0px_rgba(8,28,58,0.15)] sm:flex"
          >
            <Image src="/images/chevron-right-icon.svg" alt="" width={20} height={20} />
          </button>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`前往第 ${i + 1} 頁`}
              onClick={() => {
                const scroller = scrollerRef.current;
                if (!scroller) return;
                const pageEl = getPageEl(scroller, i);
                if (!pageEl) return;
                scroller.scrollTo({ left: pageEl.offsetLeft, behavior: "smooth" });
              }}
              className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${
                i === activePage ? "bg-[#0053E0]" : "bg-[#C3C6D6]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
