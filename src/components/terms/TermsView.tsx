"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import TermsHero from "@/components/terms/TermsHero";
import TermsTabs from "@/components/terms/TermsTabs";
import BookingProcessContent from "@/components/terms/BookingProcessContent";
import TravelContractContent from "@/components/terms/TravelContractContent";
import FraudAlertContent from "@/components/terms/FraudAlertContent";
import ServiceReminderCta from "@/components/terms/ServiceReminderCta";
import NextArticleCard from "@/components/terms/NextArticleCard";
import { TERMS_TABS, type TermsTabId } from "@/components/terms/data";

import type { ContractPage, FraudNoticePage, PurchaseFlowPage } from "@/lib/api/types/cms";

/** Tab content from the API is fetched on the server; null when the API was unreachable there. */
export default function TermsView({
  purchaseFlow,
  contract,
  fraudNotice,
}: {
  purchaseFlow: PurchaseFlowPage | null;
  contract: ContractPage | null;
  fraudNotice: FraudNoticePage | null;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TermsTabId>("booking-process");

  // 匯款資訊 (#payment-info) lives in the 訂購流程 tab: show that tab before a link to it scrolls,
  // e.g. the footer link clicked while another tab is open.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href$="#payment-info"]');
      if (link) setActiveTab("booking-process");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Arriving from another page, Next.js jumps straight to the anchor (smooth scrolling is off during
  // route changes); start from the top and glide down instead, as for in-page links.
  useEffect(() => {
    if (window.location.hash !== "#payment-info") return;
    const target = document.getElementById("payment-info");
    if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    const frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth" }));
    return () => cancelAnimationFrame(frame);
  }, []);

  // 「下一篇」 only steps through tabs shown on this page, skipping link tabs.
  const contentTabs = TERMS_TABS.filter((tab) => !tab.href);
  const nextTab = contentTabs[contentTabs.findIndex((tab) => tab.id === activeTab) + 1];

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
          {activeTab === "booking-process" && purchaseFlow && <BookingProcessContent page={purchaseFlow} />}
          {activeTab === "travel-contract" && contract && <TravelContractContent page={contract} />}
          {activeTab === "fraud-alert" && fraudNotice && <FraudAlertContent page={fraudNotice} />}

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
