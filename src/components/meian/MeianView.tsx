"use client";

import { useState } from "react";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { collectionsApi } from "@/lib/api/endpoints/collections";
import type { PublicCollection } from "@/lib/api/types/collection";
import type { PublicTripCard } from "@/lib/api/types/trip";
import MeianHero from "./MeianHero";
import MeianTripCard from "./MeianTripCard";
import MeianInquirySection from "./MeianInquirySection";

const DEFAULT_BUTTON_COLOR = "#52B2A6";

/**
 * 美安專區 page body. `collection` is the server-rendered first page (null when the API failed);
 * 「查看更多行程」 loads the following pages in the browser and hides once everything is shown.
 */
export default function MeianView({ collection }: { collection: PublicCollection | null }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [trips, setTrips] = useState<PublicTripCard[]>(collection?.items ?? []);
  const [page, setPage] = useState(collection?.page ?? 1);
  const [total, setTotal] = useState(collection?.total ?? 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);

  const hasMore = collection !== null && trips.length < total;

  const loadMore = async () => {
    if (!collection) return;
    setIsLoadingMore(true);
    setLoadMoreFailed(false);
    try {
      const next = await collectionsApi.publicGet(collection.slug, { page: page + 1 });
      setTrips((prev) => {
        const seen = new Set(prev.map((trip) => trip.trip_code));
        return [...prev, ...next.items.filter((trip) => !seen.has(trip.trip_code))];
      });
      setPage(next.page);
      // An empty page means nothing is left, whatever the total says.
      setTotal(next.items.length === 0 ? trips.length : next.total);
    } catch {
      setLoadMoreFailed(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <MeianHero collection={collection} />

        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-4 py-10 sm:px-8 sm:py-[60px] lg:px-[100px]">
          {/* Design: 1200px rows of three 360px cards spread with space-between. */}
          {trips.length > 0 && (
            <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,360px))] lg:justify-between">
              {trips.map((trip) => (
                <MeianTripCard key={trip.trip_code} trip={trip} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E0E3E8] px-[18px] text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                style={{ backgroundColor: collection?.button_color ?? DEFAULT_BUTTON_COLOR }}
              >
                {isLoadingMore ? <Spinner /> : "查看更多行程"}
                {!isLoadingMore && <Image src="/images/more-arrow-icon.svg" alt="" width={14} height={14} />}
              </button>
              {loadMoreFailed && <p className="text-sm text-[#F97066]">載入失敗，請再試一次</p>}
            </div>
          )}
        </div>

        <MeianInquirySection />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
