"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import JourneyShareHero from "./JourneyShareHero";
import JourneyGallery from "./JourneyGallery";
import { toStories } from "./data";
import type { PublicJourneyList } from "@/lib/api/types/journey";

export default function JourneyShareView({ journeys }: { journeys: PublicJourneyList | null }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <JourneyShareHero />
        <JourneyGallery stories={toStories(journeys)} />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
