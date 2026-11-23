"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

/** Site-wide 404: unknown URLs keep the normal header / footer so visitors can navigate on. */
export default function NotFoundView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <p className="font-serif text-6xl font-bold text-[#0053E0]">404</p>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-[#090909]">找不到這個頁面</h1>
          <p className="text-sm text-[#535F71]">頁面可能已移除，或網址有誤。</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex h-[42px] items-center justify-center rounded-xl bg-[#0053E0] px-6 text-base font-bold text-white transition hover:bg-[#0044b8]"
          >
            回到首頁
          </Link>
          <Link
            href="/search"
            className="flex h-[42px] items-center justify-center rounded-xl border border-[#E0E3E8] bg-white px-6 text-base font-bold text-[#002366] transition hover:bg-[#F6F6F6]"
          >
            搜尋行程
          </Link>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
