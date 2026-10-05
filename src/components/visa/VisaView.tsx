"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import VisaHero from "@/components/visa/VisaHero";
import ServiceTable, { type ServiceRow } from "@/components/visa/ServiceTable";
import OtherCountriesCta from "@/components/visa/OtherCountriesCta";
import type { VisaServices } from "@/lib/api/types/cms";

function passportRows(data: VisaServices): ServiceRow[] {
  return data.passport_items
    .filter((item) => item.visible)
    .map((item, i) => ({
      id: `passport-${i}`,
      kind: "passport",
      item: item.name,
      validity: item.validity,
      duration: item.working_days,
      fee: item.fee,
      detail: item.detail,
    }));
}

function visaRows(data: VisaServices): ServiceRow[] {
  return data.visa_items
    .filter((item) => item.visible)
    .map((item, i) => ({
      id: `visa-${i}`,
      kind: "visa",
      item: item.name,
      validity: item.validity,
      duration: item.days_text,
      fee: item.fee_text,
      detail: item.detail,
    }));
}

/** `visaServices` is fetched on the server; null when the API was unreachable there. */
export default function VisaView({ visaServices }: { visaServices: VisaServices | null }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <VisaHero />

        <section className="flex flex-col items-center gap-16 px-4 py-14 sm:px-8 lg:px-[120px] lg:py-[88px]">
          {!visaServices && (
            <p className="w-full max-w-[1200px] text-sm text-[#535F71]">
              代辦項目暫時無法載入，請稍後再試或直接聯繫專員。
            </p>
          )}

          <div className="flex w-full max-w-[1200px] flex-col gap-10">
            <div className="flex flex-col gap-1.5">
              <h2 className="font-serif text-2xl font-bold text-[#090909] sm:text-[30px]">
                護照代辦
              </h2>
              <p className="text-sm leading-[1.55] text-[#535F71]">
                先比較辦理天數與費用，點擊「查看詳情」確認所需文件。
              </p>
            </div>
            {visaServices && (
              <ServiceTable
                columns={["辦理項目", "效期", "辦理天數", "費用", "詳細說明"]}
                rows={passportRows(visaServices)}
              />
            )}
            <p className="text-[13px] leading-[1.55] text-[#535F71]">
              護照加頁、代領護照或其他特殊狀況，請直接聯繫專員確認辦理方式與費用。
            </p>
          </div>

          <div className="flex w-full max-w-[1200px] flex-col gap-10">
            <div className="flex flex-col gap-1.5">
              <h2 className="font-serif text-2xl font-bold text-[#090909] sm:text-[30px]">
                熱門國家簽證
              </h2>
              <p className="text-sm leading-[1.55] text-[#535F71]">
                優先整理台灣旅客最常詢問的市場；詳細規範以各國最新公告與專員確認為準。
              </p>
            </div>
            {visaServices && (
              <ServiceTable
                columns={["辦理項目", "效期／停留", "辦理天數", "費用", "詳細說明"]}
                rows={visaRows(visaServices)}
              />
            )}
            <OtherCountriesCta />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
