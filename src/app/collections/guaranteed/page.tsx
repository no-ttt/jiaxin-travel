"use client";

import { useState } from "react";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import GuaranteedHero from "@/components/guaranteed/GuaranteedHero";
import GuaranteedFilters, {
  ALL_DESTINATIONS,
  ALL_MONTHS,
  type GuaranteedFilterState,
} from "@/components/guaranteed/GuaranteedFilters";
import GuaranteedTripCard from "@/components/guaranteed/GuaranteedTripCard";
import { usePublicCollectionPages } from "@/lib/api/hooks/useCollections";
import { useNavigation } from "@/lib/api/hooks/useCms";

const COLLECTION_SLUG = "guaranteed";

const SORT_PARAM: Record<string, string | undefined> = {
  依出發日期: undefined,
  價格由低到高: "price_asc",
  價格由高到低: "price_desc",
};

const INITIAL_FILTERS: GuaranteedFilterState = {
  destination: ALL_DESTINATIONS,
  departureMonth: ALL_MONTHS,
  duration: "不限",
  sort: "依出發日期",
};

/** 旅遊天數 option → the API's `duration_band` (same bands as the search page). */
const DURATION_BAND: Record<string, string> = {
  "1-5 天": "1-5",
  "6-10 天": "6-10",
  "11-15 天": "11-15",
  "15 天以上": "15+",
};

export default function GuaranteedDeparturePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<GuaranteedFilterState>(INITIAL_FILTERS);

  const { data: navigation } = useNavigation();
  const regions = navigation?.regions ?? [];
  const regionId = regions.find((region) => region.name === filters.destination)?.id;
  const month = filters.departureMonth === ALL_MONTHS ? undefined : parseInt(filters.departureMonth, 10);

  // 目的地／出發月份／旅遊天數／排序 are all filtered and sorted by the API.
  const { data, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
    usePublicCollectionPages(COLLECTION_SLUG, {
      region_ids: regionId,
      departure_months: month,
      duration_band: DURATION_BAND[filters.duration],
      sort: SORT_PARAM[filters.sort],
    });

  const collection = data?.pages[0];
  const trips = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-10 sm:px-8 sm:py-12 lg:px-10">
          <GuaranteedHero collection={collection} />

          <GuaranteedFilters
            filters={filters}
            regionNames={regions.map((region) => region.name)}
            onChange={setFilters}
          />

          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-2xl font-bold text-[#090909]">
              {collection?.total ?? 0} 個保證出團行程
            </h2>
            <p className="text-[13px] text-[#535F71]">
              出發日期已確認，可依目的地與月份快速瀏覽。
            </p>
          </div>

          {isPending ? null : trips.length > 0 ? (
            <>
              {/* Design: 1200px rows of three 360px cards spread with space-between. */}
              <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,360px))] lg:justify-between">
                {trips.map((trip) => (
                  <GuaranteedTripCard key={trip.trip_code} trip={trip} />
                ))}
              </div>
              {hasNextPage && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E0E3E8] px-[18px] text-sm font-medium text-[#002366] transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
                  >
                    {isFetchingNextPage ? <Spinner /> : "查看更多行程"}
                    {!isFetchingNextPage && (
                      <Image src="/images/more-trips-arrow-icon.svg" alt="" width={14} height={14} />
                    )}
                  </button>
                  {isFetchNextPageError && <p className="text-sm text-[#F97066]">載入失敗，請再試一次</p>}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#C3C6D6] bg-white py-16 text-center">
              <p className="text-base font-medium text-[#090909]">
                {isError ? "行程資料載入失敗" : "找不到符合條件的行程"}
              </p>
              <p className="text-sm text-[#535F71]">{isError ? "請稍後再試" : "請試著調整篩選條件"}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
