"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import VisaHero from "@/components/visa/VisaHero";
import ServiceTable from "@/components/visa/ServiceTable";
import OtherCountriesCta from "@/components/visa/OtherCountriesCta";
import { PASSPORT_ROWS, VISA_ROWS } from "@/components/visa/data";

export default function VisaPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1">
        <VisaHero />

        <section className="flex flex-col items-center gap-16 px-4 py-14 sm:px-8 lg:px-[120px] lg:py-[88px]">
          <div className="flex w-full max-w-[1200px] flex-col gap-10">
            <div className="flex flex-col gap-1.5">
              <h2 className="font-serif text-2xl font-bold text-[#090909] sm:text-[30px]">
                護照代辦
              </h2>
              <p className="text-sm leading-[1.55] text-[#535F71]">
                先比較辦理天數與費用，點擊「查看詳情」確認所需文件。
              </p>
            </div>
            <ServiceTable
              columns={["辦理項目", "效期", "辦理天數", "費用", "詳細說明"]}
              rows={PASSPORT_ROWS}
            />
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
            <ServiceTable
              columns={["辦理項目", "效期／停留", "辦理天數", "費用", "詳細說明"]}
              rows={VISA_ROWS}
            />
            <OtherCountriesCta />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
