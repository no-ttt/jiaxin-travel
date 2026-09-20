"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import GuaranteedHero from "@/components/guaranteed/GuaranteedHero";
import GuaranteedFilters, {
  type GuaranteedFilterState,
} from "@/components/guaranteed/GuaranteedFilters";
import GuaranteedTripCard from "@/components/guaranteed/GuaranteedTripCard";
import { GUARANTEED_TRIPS } from "@/components/guaranteed/data";

const INITIAL_FILTERS: GuaranteedFilterState = {
  destination: "全部地區",
  departureMonth: "全部月份",
  duration: "不限",
  sort: "依出發日期",
};

function matchesDuration(days: number, duration: string) {
  if (duration === "不限") return true;
  if (duration === "4-5 天") return days >= 4 && days <= 5;
  if (duration === "6-7 天") return days >= 6 && days <= 7;
  if (duration === "8 天以上") return days >= 8;
  return true;
}

export default function GuaranteedDeparturePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<GuaranteedFilterState>(INITIAL_FILTERS);

  const trips = useMemo(() => {
    const filtered = GUARANTEED_TRIPS.filter((trip) => {
      const destinationMatch =
        filters.destination === "全部地區" || trip.title.includes(filters.destination);
      const monthMatch =
        filters.departureMonth === "全部月份" || trip.departureMonth === filters.departureMonth;
      const durationMatch = matchesDuration(trip.durationDays, filters.duration);
      return destinationMatch && monthMatch && durationMatch;
    });

    const sorted = [...filtered];
    if (filters.sort === "價格由低到高") sorted.sort((a, b) => a.priceValue - b.priceValue);
    else if (filters.sort === "價格由高到低") sorted.sort((a, b) => b.priceValue - a.priceValue);

    return sorted;
  }, [filters]);

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-10 sm:px-8 sm:py-12 lg:px-10">
          <GuaranteedHero />

          <GuaranteedFilters filters={filters} onChange={setFilters} />

          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-2xl font-bold text-[#090909]">
              {trips.length} 個保證出團行程
            </h2>
            <p className="text-[13px] text-[#535F71]">
              出發日期已確認，可依目的地與月份快速瀏覽。
            </p>
          </div>

          {trips.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <GuaranteedTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#C3C6D6] bg-white py-16 text-center">
              <p className="text-base font-medium text-[#090909]">找不到符合條件的行程</p>
              <p className="text-sm text-[#535F71]">請試著調整篩選條件</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
