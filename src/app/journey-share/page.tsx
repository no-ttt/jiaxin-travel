"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import JourneyShareHero from "@/components/journey-share/JourneyShareHero";
import JourneyGallery from "@/components/journey-share/JourneyGallery";

export default function JourneySharePage() {
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
        <JourneyGallery />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
