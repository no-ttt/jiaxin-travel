"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import DecisionInfo from "./DecisionInfo";
import FlightInfo from "./FlightInfo";
import Highlights from "./Highlights";
import DailyArrangement from "./DailyArrangement";
import BookingNotice from "./BookingNotice";
import ServiceCta from "./ServiceCta";
import StickySideAnchor from "./StickySideAnchor";
import type { TripDetail } from "./types";

/**
 * Trip detail page body, shared by the public trip page and the admin preview. `trip` null
 * renders the not-found / load-failed message; `previewNotice` shows a banner above the header.
 */
export default function TripDetailView({
  trip,
  failed = false,
  previewNotice = null,
}: {
  trip: TripDetail | null;
  failed?: boolean;
  previewNotice?: string | null;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-white">
      {previewNotice && (
        <div className="bg-[#FFF4E5] px-4 py-2 text-center text-sm font-medium text-[#B45309]">
          {previewNotice}
        </div>
      )}
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        {trip ? (
          <div className="mx-auto flex max-w-[940px] flex-col px-4 py-14 sm:px-8 lg:px-0">
            <DecisionInfo trip={trip} />
            {trip.flights.length > 0 && <FlightInfo flights={trip.flights} note={trip.flightNote} />}
            <Highlights trip={trip} />
            {trip.days.length > 0 && <DailyArrangement days={trip.days} />}
            <BookingNotice trip={trip} />
            <div className="pt-10">
              <ServiceCta />
            </div>
          </div>
        ) : (
          <div className="flex h-[480px] flex-col items-center justify-center gap-2 text-center">
            <p className="text-base font-medium text-[#090909]">
              {failed ? "行程資料載入失敗" : "找不到這個行程"}
            </p>
            <p className="text-sm text-[#535F71]">
              {failed ? "請稍後重新整理頁面。" : "行程可能已下架，或網址有誤。"}
            </p>
          </div>
        )}
      </main>

      <Footer />
      <StickySideAnchor />
      <FloatingActions />
    </div>
  );
}
