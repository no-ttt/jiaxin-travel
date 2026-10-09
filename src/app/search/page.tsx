"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import CompactSearchBar, { type SearchQuery } from "@/components/search/CompactSearchBar";
import SearchSummary, { type SortOption } from "@/components/search/SearchSummary";
import FilterPanel from "@/components/search/FilterPanel";
import TripResultCard, { type TripResult } from "@/components/search/TripResultCard";
import { buildSearchHref, parseSearchParams, toApiParams } from "@/components/search/searchUrl";
import { useNavigation } from "@/lib/api/hooks/useCms";
import { usePublicTripSearch } from "@/lib/api/hooks/useTrips";
import type { PublicTripCard } from "@/lib/api/types/trip";
import Pagination from "@/components/search/Pagination";
import CustomTripCta from "@/components/search/CustomTripCta";
import { filtersToApiParams } from "@/components/search/filters";
import FloatingActions from "@/components/FloatingActions";

const RESULTS_PER_PAGE = 6;

const SORT_TO_API: Record<SortOption, string> = {
  popular: "popular",
  "departure-date": "departure_date",
  "price-desc": "price_desc",
  "price-asc": "price_asc",
};

const ZONE_LABELS: Record<string, string> = {
  overseas_group: "國外團體",
  theme_travel: "主題旅遊",
  premium: "精緻璽品",
  meian: "美安專區",
};

function toTripResult(trip: PublicTripCard): TripResult {
  const cover = trip.cover;
  return {
    id: trip.trip_code,
    image: cover ? (cover.variants.card ?? cover.url) : null,
    title: trip.product_name,
    description: trip.description,
    price: trip.price_from != null ? trip.price_from.toLocaleString() : "—",
    currency: trip.currency,
    externalUrl: trip.trip_type === "external" ? trip.external_url : null,
  };
}

function Spinner() {
  return <span className="block h-8 w-8 shrink-0 animate-spin rounded-full border-[3px] border-[#E0E3E8] border-t-[#0053E0]" />;
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Applied criteria live in the URL, so refresh / shared links keep the search.
  const applied = useMemo(
    () => parseSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState<SearchQuery>({
    destination: applied.destination,
    keyword: applied.keyword,
    startDate: applied.dateFrom,
    endDate: applied.dateTo,
  });
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>("popular");
  const [page, setPage] = useState(1);

  // A new URL (e.g. arriving from the homepage) refills the bar and restarts at page 1.
  const [prevApplied, setPrevApplied] = useState(applied);
  if (applied !== prevApplied) {
    setPrevApplied(applied);
    setQuery({
      destination: applied.destination,
      keyword: applied.keyword,
      startDate: applied.dateFrom,
      endDate: applied.dateTo,
    });
    setPage(1);
  }

  const { data: navigation, isLoading: isNavLoading } = useNavigation();
  const params = {
    ...toApiParams(applied, navigation?.regions ?? []),
    ...filtersToApiParams(selectedFilters),
    sort: SORT_TO_API[sort],
    page,
    limit: RESULTS_PER_PAGE,
  };
  // Region matching needs the navigation regions; wait for them when a destination is set.
  const { data, isFetching, isError } = usePublicTripSearch(params, {
    enabled: !(applied.destination && isNavLoading),
  });
  // Previous results stay on screen while a new filter / page loads, so show a spinner over them.
  const isSearching = isFetching || Boolean(applied.destination && isNavLoading);
  const results = (data?.items ?? []).map(toTripResult);
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / RESULTS_PER_PAGE));

  const themeName = navigation?.themes.find((t) => t.id === applied.themeId)?.name;
  const summaryLabel =
    [applied.destination, applied.keyword, themeName].filter(Boolean).join("・") ||
    (applied.zone ? ZONE_LABELS[applied.zone] : "") ||
    "全部行程";

  const toggleFilter = (option: string) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
    setPage(1);
  };

  const handleSearch = () => {
    router.replace(
      buildSearchHref({
        ...applied,
        destination: query.destination,
        keyword: query.keyword,
        dateFrom: query.startDate,
        dateTo: query.endDate,
      }),
      { scroll: false }
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-[#F9FAFC]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <div className="relative bg-gradient-to-r from-[#E5F0FB] via-[#EEF5FC] to-[#F9FBFD] pb-10 pt-6">
          <CompactSearchBar
            query={query}
            onChange={setQuery}
            onSearch={handleSearch}
          />
        </div>

        <div className="mx-4 flex flex-col gap-8 py-10 sm:mx-8 lg:mx-[120px]">
          <SearchSummary
            destination={summaryLabel}
            resultCount={total}
            activeFilters={Array.from(selectedFilters)}
            onRemoveFilter={toggleFilter}
            sort={sort}
            onSortChange={(next) => {
              setSort(next);
              setPage(1);
            }}
          />

          <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
            <FilterPanel
              selected={selectedFilters}
              onToggle={toggleFilter}
              onClear={() => {
                setSelectedFilters(new Set());
                setPage(1);
              }}
            />
            <div className="relative flex min-w-0 flex-1 flex-col gap-4" aria-busy={isSearching}>
              {isSearching && results.length > 0 && (
                <div
                  className="absolute inset-0 z-10 flex justify-center rounded-2xl bg-white/60"
                  role="status"
                  aria-label="搜尋中"
                >
                  {/* Sticky so the spinner stays in view when the list is scrolled. */}
                  <div className="sticky top-[45vh] mt-24 h-8 w-8">
                    <Spinner />
                  </div>
                </div>
              )}
              {results.length > 0 ? (
                results.map((trip) => <TripResultCard key={trip.id} trip={trip} />)
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#C3C6D6] bg-white py-16 text-center">
                  {isSearching ? (
                    <div className="flex flex-col items-center gap-3" role="status">
                      <Spinner />
                      <p className="text-sm text-[#94969C]">搜尋中…</p>
                    </div>
                  ) : isError ? (
                    <p className="text-base font-medium text-[#090909]">搜尋失敗，請稍後再試</p>
                  ) : (
                    <>
                      <p className="text-base font-medium text-[#090909]">找不到符合條件的行程</p>
                      <p className="text-sm text-[#535F71]">請試著調整篩選條件</p>
                    </>
                  )}
                </div>
              )}
              {results.length > 0 && (
                <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
              )}
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

export default function SearchPage() {
  // useSearchParams needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
