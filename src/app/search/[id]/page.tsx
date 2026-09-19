"use client";

import { use, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import DecisionInfo from "@/components/trip-detail/DecisionInfo";
import FlightInfo from "@/components/trip-detail/FlightInfo";
import Highlights from "@/components/trip-detail/Highlights";
import DailyArrangement from "@/components/trip-detail/DailyArrangement";
import BookingNotice from "@/components/trip-detail/BookingNotice";
import ServiceCta from "@/components/trip-detail/ServiceCta";
import StickySideAnchor from "@/components/trip-detail/StickySideAnchor";
import { getTripDetail } from "@/components/trip-detail/data";

export default function TripDetailPage({ params }: PageProps<"/search/[id]">) {
  const { id } = use(params);
  const trip = getTripDetail(id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1">
        <div className="mx-auto flex max-w-[940px] flex-col px-4 py-14 sm:px-8 lg:px-0">
          <DecisionInfo trip={trip} />
          <FlightInfo flights={trip.flights} />
          <Highlights trip={trip} />
          <DailyArrangement days={trip.days} />
          <BookingNotice trip={trip} />
          <div className="pt-10">
            <ServiceCta />
          </div>
        </div>
      </main>

      <Footer />
      <StickySideAnchor />
      <FloatingActions />
    </div>
  );
}
