"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import TermsHero from "@/components/terms/TermsHero";
import TermsTabs from "@/components/terms/TermsTabs";
import BookingProcessContent from "@/components/terms/BookingProcessContent";
import TravelContractContent from "@/components/terms/TravelContractContent";
import FraudAlertContent from "@/components/terms/FraudAlertContent";
import ComingSoonContent from "@/components/terms/ComingSoonContent";
import ServiceReminderCta from "@/components/terms/ServiceReminderCta";
import NextArticleCard from "@/components/terms/NextArticleCard";
import { TERMS_TABS, type TermsTabId } from "@/components/terms/data";

const TAB_CONTENT: Partial<Record<TermsTabId, () => React.ReactElement>> = {
  "booking-process": BookingProcessContent,
  "travel-contract": TravelContractContent,
  "fraud-alert": FraudAlertContent,
};

export default function TermsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TermsTabId>("booking-process");

  const activeTabIndex = TERMS_TABS.findIndex((tab) => tab.id === activeTab);
  const activeTabLabel = TERMS_TABS[activeTabIndex]?.label ?? "";
  const nextTab = TERMS_TABS[activeTabIndex + 1];
  const ActiveContent = TAB_CONTENT[activeTab];

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <TermsHero />
        <TermsTabs activeTab={activeTab} onChange={setActiveTab} />

        <section className="flex flex-col items-center gap-9 px-4 py-14 sm:px-8 lg:px-[120px] lg:py-16">
          {ActiveContent ? <ActiveContent /> : <ComingSoonContent title={activeTabLabel} />}

          <div className="flex w-full max-w-[1200px] flex-col items-stretch gap-6 sm:flex-row">
            <ServiceReminderCta />
            {nextTab && (
              <NextArticleCard
                label={nextTab.label}
                onClick={() => setActiveTab(nextTab.id)}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
