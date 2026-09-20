"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import MeianHero from "@/components/meian/MeianHero";
import MeianTripCard from "@/components/meian/MeianTripCard";
import MeianInquirySection from "@/components/meian/MeianInquirySection";
import { MEIAN_TRIPS } from "@/components/meian/data";

export default function MeianPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <MeianHero />

        <div className="flex flex-col gap-12 px-4 py-10 sm:px-8 sm:py-12 lg:px-[100px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MEIAN_TRIPS.map((trip) => (
              <MeianTripCard key={trip.id} trip={trip} />
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E0E3E8] bg-[#52B2A6] px-[18px] text-sm font-medium text-white transition hover:bg-[#469a8f]"
            >
              查看更多行程
              <Image src="/images/more-arrow-icon.svg" alt="" width={14} height={14} />
            </button>
          </div>
        </div>

        <MeianInquirySection />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
