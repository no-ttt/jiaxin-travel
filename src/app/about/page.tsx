"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import AboutHero from "@/components/about/AboutHero";
import CorePillars from "@/components/about/CorePillars";
import TrustCredentials from "@/components/about/TrustCredentials";
import AboutCtaSplit from "@/components/about/AboutCtaSplit";
import TestimonialCarousel, { type Testimonial } from "@/components/TestimonialCarousel";

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    photo: { kind: "photo", image: "/images/testimonial-1.png" },
    quote: "嘉新服務超好～滑雪之旅，挑戰自己的極限！",
    name: "呂小姐",
    meta: "沖繩三日｜2025 年 9 月",
  },
  {
    id: "2",
    photo: { kind: "stamp", code: "JP", label: "HOKKAIDO" },
    quote: "人生最難忘的一次北海道之旅～",
    name: "陳小姐",
    meta: "北海道九日｜2025 年 2 月",
  },
  {
    id: "3",
    photo: { kind: "photo", image: "/images/testimonial-3.png" },
    quote: "人生最難忘的一次北海道之旅～",
    name: "呂小姐",
    meta: "沖繩三日｜2025 年 9 月",
  },
  {
    id: "4",
    photo: { kind: "photo", image: "/images/testimonial-4.png" },
    quote: "大阪的街頭美食讓人流連忘返，超推薦！",
    name: "李先生",
    meta: "大阪六日｜2025 年 3 月",
  },
];

export default function AboutPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <AboutHero />
        <CorePillars />
        <TrustCredentials />
        <TestimonialCarousel testimonials={TESTIMONIALS} />
        <AboutCtaSplit />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
