"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import CustomTripHero from "@/components/custom-trip/CustomTripHero";
import FeatureCards from "@/components/custom-trip/FeatureCards";
import CustomTripForm from "@/components/custom-trip/CustomTripForm";

export default function CustomTripPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToForm = () => {
    document.getElementById("custom-trip-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="flex flex-1 flex-col"
      style={{
        background:
          "linear-gradient(90deg, rgba(237, 250, 251, 0.5) 0%, rgba(252, 251, 249, 0.5) 52%, rgba(244, 249, 255, 0.5) 100%), #FAFAFA",
      }}
    >
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1">
        <CustomTripHero onCtaClick={scrollToForm} />
        <FeatureCards />
        <CustomTripForm />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
