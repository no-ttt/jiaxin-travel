"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import CompactSearchBar, { type SearchQuery } from "@/components/search/CompactSearchBar";
import SearchSummary, { type SortOption } from "@/components/search/SearchSummary";
import FilterPanel from "@/components/search/FilterPanel";
import TripResultCard, { type TripResult } from "@/components/search/TripResultCard";
import Pagination from "@/components/search/Pagination";
import CustomTripCta from "@/components/search/CustomTripCta";
import { DEFAULT_SELECTED_FILTERS, filterTrips } from "@/components/search/filters";
import FloatingActions from "@/components/FloatingActions";

const ALL_RESULTS: TripResult[] = [
  {
    id: "fuji",
    image: "/images/search-result-fuji.png",
    title: "富士之巔・藝術巡禮",
    description: "深度走訪山中湖美術館，入住對望富士山的私人別墅。",
    price: "42,000",
    priceValue: 42000,
    durationDays: 6,
    season: "秋季（9–11 月）",
  },
  {
    id: "kyoto",
    image: "/images/search-result-kyoto.png",
    title: "京都古寺・紅葉秘境",
    description: "漫步嵐山竹林與金閣寺，體驗千年古都的四季風華。",
    price: "35,000",
    priceValue: 35000,
    durationDays: 5,
    season: "秋季（9–11 月）",
  },
  {
    id: "hokkaido",
    image: "/images/search-result-hokkaido.png",
    title: "北海道・冬日雪國",
    description: "暢遊小樽運河與富良野花田，品嚐新鮮海鮮與溫泉療癒。",
    price: "48,000",
    priceValue: 48000,
    durationDays: 9,
    season: "冬季（12–2 月）",
  },
  {
    id: "okinawa",
    image: "/images/search-result-okinawa.png",
    title: "沖繩碧海・島嶼假期",
    description: "探索美麗海水族館與古宇利島，享受南國陽光與白沙灘。",
    price: "32,000",
    priceValue: 32000,
    durationDays: 4,
    season: "夏季（6–8 月）",
  },
  {
    id: "tokyo",
    image: "/images/search-result-tokyo.png",
    title: "東京潮流・都會探索",
    description: "穿梭澀谷與原宿街頭，感受最前衛的時尚與美食文化。",
    price: "38,000",
    priceValue: 38000,
    durationDays: 7,
    season: "春季（3–5 月）",
  },
  {
    id: "setouchi",
    image: "/images/search-result-setouchi.png",
    title: "瀨戶內海・藝術跳島",
    description: "造訪直島地中美術館與豐島，沉浸於海與藝術的對話。",
    price: "45,000",
    priceValue: 45000,
    durationDays: 8,
    season: "秋季（9–11 月）",
  },
];

const RESULTS_PER_PAGE = 6;

export default function SearchPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState<SearchQuery>({
    destination: "日本北海道",
    keyword: "溫泉、花田、美食",
    startDate: "2027-01-06",
    endDate: "2027-01-14",
  });
  const [appliedDestination, setAppliedDestination] = useState("日本・北海道");
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(DEFAULT_SELECTED_FILTERS);
  const [sort, setSort] = useState<SortOption>("popular");

  const toggleFilter = (option: string) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  };

  const results = useMemo(() => {
    const filtered = filterTrips(ALL_RESULTS, selectedFilters);
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceValue - b.priceValue);
    else if (sort === "price-desc") sorted.sort((a, b) => b.priceValue - a.priceValue);
    return sorted;
  }, [selectedFilters, sort]);

  const pageCount = Math.max(1, Math.ceil(results.length / RESULTS_PER_PAGE));

  return (
    <div className="flex flex-1 flex-col bg-[#F9FAFC]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1">
        <div className="relative bg-gradient-to-r from-[#E5F0FB] via-[#EEF5FC] to-[#F9FBFD] pb-10 pt-6">
          <CompactSearchBar
            query={query}
            onChange={setQuery}
            onSearch={() => setAppliedDestination(query.destination)}
          />
        </div>

        <div className="mx-4 flex flex-col gap-8 py-10 sm:mx-8 lg:mx-[120px]">
          <SearchSummary
            destination={appliedDestination}
            resultCount={results.length}
            activeFilters={Array.from(selectedFilters)}
            onRemoveFilter={toggleFilter}
            sort={sort}
            onSortChange={setSort}
          />

          <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
            <FilterPanel
              selected={selectedFilters}
              onToggle={toggleFilter}
              onClear={() => setSelectedFilters(new Set())}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {results.length > 0 ? (
                results.map((trip) => <TripResultCard key={trip.id} trip={trip} />)
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#C3C6D6] bg-white py-16 text-center">
                  <p className="text-base font-medium text-[#090909]">找不到符合條件的行程</p>
                  <p className="text-sm text-[#535F71]">請試著調整篩選條件</p>
                </div>
              )}
              {results.length > 0 && <Pagination pageCount={pageCount} />}
            </div>
          </div>

          <CustomTripCta />
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
