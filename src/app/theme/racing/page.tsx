"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import RacingHero from "@/components/theme-racing/RacingHero";
import RacingTripCard from "@/components/theme-racing/RacingTripCard";
import { RACING_TRIPS } from "@/components/theme-racing/data";

export default function RacingThemePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-[#0B090F]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <RacingHero />

        <div className="flex flex-col gap-12 px-4 py-10 sm:px-8 sm:py-12 lg:px-[100px] lg:py-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {RACING_TRIPS.map((trip) => (
              <RacingTripCard key={trip.id} trip={trip} />
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#FF5C00] px-[18px] text-sm font-medium text-white transition hover:bg-[#e05200]"
            >
              查看更多行程
              <Image src="/images/more-arrow-icon.svg" alt="" width={14} height={14} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
