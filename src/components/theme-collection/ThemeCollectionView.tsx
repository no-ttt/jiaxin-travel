"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { collectionsApi } from "@/lib/api/endpoints/collections";
import type { PublicCollection } from "@/lib/api/types/collection";
import type { PublicTripCard } from "@/lib/api/types/trip";
import ThemeHero from "./ThemeHero";
import ThemeTripCard from "./ThemeTripCard";
import { DEFAULT_BUTTON_COLOR } from "./colors";

/**
 * Theme collection page body. `collection` is the server-rendered first page; null renders the
 * not-found / load-failed message. 「查看更多行程」 loads the following pages in the browser.
 */
export default function ThemeCollectionView({
  collection,
  themeName = null,
  failed = false,
}: {
  collection: PublicCollection | null;
  /** 產品分類設定 theme name, shown in the hero label (主題旅遊 / 賽車). */
  themeName?: string | null;
  failed?: boolean;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [trips, setTrips] = useState<PublicTripCard[]>(collection?.items ?? []);
  const [page, setPage] = useState(collection?.page ?? 1);
  // Latest total from the API: trips removed after the page rendered shrink it, so the button hides.
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
    <div className="flex flex-1 flex-col bg-[#0B090F]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        {collection ? (
          <>
            <ThemeHero collection={collection} themeName={themeName} />

            <div className="flex flex-col gap-12 px-4 py-10 sm:px-8 sm:py-12 lg:px-[100px] lg:py-20">
              {trips.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {trips.map((trip) => (
                    <ThemeTripCard key={trip.trip_code} trip={trip} />
                  ))}
                </div>
              ) : (
                <p className="py-16 text-center text-base text-[#A29DB0]">此主題目前尚無行程，敬請期待。</p>
              )}

              {hasMore && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="flex h-11 min-w-[132px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl px-[18px] text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                    style={{ backgroundColor: collection.button_color ?? DEFAULT_BUTTON_COLOR }}
                  >
                    {isLoadingMore ? "載入中…" : "查看更多行程"}
                    {!isLoadingMore && <Image src="/images/more-arrow-down-icon.svg" alt="" width={14} height={14} />}
                  </button>
                  {loadMoreFailed && <p className="text-sm text-[#F97066]">載入失敗，請再試一次</p>}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-[480px] flex-col items-center justify-center gap-2 text-center">
            <p className="text-base font-medium text-white">{failed ? "主題資料載入失敗" : "找不到這個主題"}</p>
            <p className="text-sm text-[#A29DB0]">
              {failed ? "請稍後再試" : "此主題可能已下架或暫不開放，請從選單選擇其他主題"}
            </p>
          </div>
        )}
      </main>

      <Footer variant="dark" />
      <FloatingActions />
    </div>
  );
}
