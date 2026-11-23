"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import TermsHero from "@/components/terms/TermsHero";
import TermsTabs from "@/components/terms/TermsTabs";
import BookingProcessContent from "@/components/terms/BookingProcessContent";
import TravelContractContent from "@/components/terms/TravelContractContent";
import SectionsContent from "@/components/terms/SectionsContent";
import ServiceReminderCta from "@/components/terms/ServiceReminderCta";
import NextArticleCard from "@/components/terms/NextArticleCard";
import {
  PAYMENT_INFO_KEY,
  TERMS_TABS,
  termsTabFromKey,
  termsTabHref,
  type TermsTabId,
} from "@/components/terms/data";

import type { ContractPage, FraudNoticePage, PolicyPage, PurchaseFlowPage } from "@/lib/api/types/cms";

/** Tab content from the API is fetched on the server; null when the API was unreachable there. */
export default function TermsView({
  purchaseFlow,
  cancellationPolicy,
  contract,
  fraudNotice,
  announcements,
}: {
  purchaseFlow: PurchaseFlowPage | null;
  cancellationPolicy: PolicyPage | null;
  contract: ContractPage | null;
  fraudNotice: FraudNoticePage | null;
  announcements: PolicyPage | null;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // The URL is the source of truth: /pages/{key} picks the tab; switching tabs pushes a new URL
  // (Next syncs usePathname with history.pushState, so back/forward switch tabs too).
  const pathname = usePathname();
  const pathKey = decodeURIComponent(pathname.split("/").pop() ?? "");
  const activeTab = termsTabFromKey(pathKey) ?? "purchase-flow";
  const setActiveTab = (id: TermsTabId) => {
    if (id !== activeTab) window.history.pushState(null, "", termsTabHref(id));
  };

  // /pages/payment-info: glide down to 匯款資訊 once the 訂購流程 tab is on screen.
  useEffect(() => {
    if (pathKey !== PAYMENT_INFO_KEY && window.location.hash !== `#${PAYMENT_INFO_KEY}`) return;
    const target = document.getElementById(PAYMENT_INFO_KEY);
    if (!target) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: smooth ? "smooth" : "auto" }));
    return () => cancelAnimationFrame(frame);
  }, [pathKey]);

  // 「下一篇」 sits at the bottom: after switching, start the new article from its top (just under the header).
  const contentRef = useRef<HTMLElement>(null);
  const goToNextTab = (id: TermsTabId) => {
    setActiveTab(id);
    contentRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  };

  // 「下一篇」 steps through the tabs in order; the last one wraps back to the first (per the design).
  const nextTab = TERMS_TABS[(TERMS_TABS.findIndex((tab) => tab.id === activeTab) + 1) % TERMS_TABS.length];

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

        <section
          ref={contentRef}
          className="flex scroll-mt-[var(--header-height)] flex-col items-center gap-9 px-4 py-14 sm:px-8 lg:px-[120px] lg:py-16"
        >
          {activeTab === "purchase-flow" && purchaseFlow && <BookingProcessContent page={purchaseFlow} />}
          {activeTab === "cancellation-policy" && cancellationPolicy && (
            <SectionsContent page={cancellationPolicy} />
          )}
          {activeTab === "contract" && contract && <TravelContractContent page={contract} />}
          {activeTab === "fraud-notice" && fraudNotice && <SectionsContent page={fraudNotice} />}
          {activeTab === "announcements" && announcements && <SectionsContent page={announcements} />}

          <div className="flex w-full max-w-[1200px] flex-col items-stretch gap-6 sm:flex-row">
            <ServiceReminderCta />
            <NextArticleCard label={nextTab.label} onClick={() => goToNextTab(nextTab.id)} />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
