"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Sidebar from "@/components/Sidebar";
import VideoLayout from "@/components/VideoLayout";
import PopularSearch from "@/components/PopularSearch";
import TourCarousel, { type Tour } from "@/components/TourCarousel";
import OurStandards from "@/components/OurStandards";
import TestimonialCarousel, { type Testimonial } from "@/components/TestimonialCarousel";
import Footer from "@/components/Footer";

const VIDEOS = [
  { id: "okinawa", image: "/images/video-okinawa.png", title: "沖繩潛水探險" },
  { id: "shirakawago", image: "/images/video-shirakawago.png", title: "白川鄉冬日之旅" },
  { id: "hakone", image: "/images/video-hakone.png", title: "箱根溫泉秘境" },
];

const GUARANTEED_DEPARTURE_TOUR_TEMPLATE: Omit<Tour, "id">[] = [
  {
    image: "/images/tour-fuji.png",
    title: "富士之巔・藝術巡禮",
    description: "深度走訪山中湖美術館，入住對望富士山的私人別墅。",
    price: "42,000",
  },
  {
    image: "/images/tour-kyoto.png",
    title: "京都古寺・禪意漫遊",
    description: "探訪金閣寺與嵐山竹林，體驗正統茶道與和服散策。",
    price: "38,500",
  },
  {
    image: "/images/tour-hokkaido.png",
    title: "北海道・花海牧場行",
    description: "暢遊富良野薰衣草花田，品嚐十勝鮮乳與海鮮料理。",
    price: "45,800",
  },
];

const GUARANTEED_DEPARTURE_TOURS: Tour[] = Array.from({ length: 3 }).flatMap((_, round) =>
  GUARANTEED_DEPARTURE_TOUR_TEMPLATE.map((tour, i) => ({
    ...tour,
    id: `guaranteed-${round}-${i}`,
  })),
);

const PREMIUM_SELECTION_TOUR_TEMPLATE: Omit<Tour, "id">[] = [
  {
    image: "/images/tour-ginza.png",
    title: "東京銀座・奢華美食",
    description: "米其林三星主廚私宴，入住安縵東京頂級套房。",
    price: "88,000",
  },
  {
    image: "/images/tour-hakone-onsen.png",
    title: "箱根溫泉・私湯秘境",
    description: "獨享露天私人溫泉，遠眺蘆之湖與箱根連山美景。",
    price: "72,500",
  },
  {
    image: "/images/tour-setouchi.png",
    title: "瀨戶內海・藝術島嶼",
    description: "直島地中美術館與豐島藝術之旅，搭乘私人遊艇。",
    price: "95,000",
  },
];

const PREMIUM_SELECTION_TOURS: Tour[] = Array.from({ length: 3 }).flatMap((_, round) =>
  PREMIUM_SELECTION_TOUR_TEMPLATE.map((tour, i) => ({
    ...tour,
    id: `premium-${round}-${i}`,
  })),
);

const THEME_TRAVEL_TOUR_TEMPLATE: Omit<Tour, "id">[] = [
  {
    image: "/images/tour-okinawa-diving.png",
    title: "沖繩潛水・珊瑚探索",
    description: "慶良間群島浮潛與深潛體驗，探索海底珊瑚世界。",
    price: "35,200",
  },
  {
    image: "/images/tour-shirakawago.png",
    title: "白川鄉・合掌村冬景",
    description: "冬季限定點燈夜景，體驗百年合掌造農家住宿。",
    price: "52,000",
  },
  {
    image: "/images/tour-kyushu.png",
    title: "九州鐵道・溫泉巡遊",
    description: "搭乘由布院之森觀光列車，走訪別府八湯溫泉鄉。",
    price: "46,500",
  },
];

const THEME_TRAVEL_TOURS: Tour[] = Array.from({ length: 3 }).flatMap((_, round) =>
  THEME_TRAVEL_TOUR_TEMPLATE.map((tour, i) => ({
    ...tour,
    id: `theme-${round}-${i}`,
  })),
);

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

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1">
        <Banner />
        <section className="mx-4 my-12 flex flex-col gap-20 sm:mx-8 lg:mx-[120px]">
          <VideoLayout videos={VIDEOS} />
          <PopularSearch />
          <TourCarousel
            eyebrow="Guaranteed Departure"
            title="保證出團"
            tours={GUARANTEED_DEPARTURE_TOURS}
            moreHref="/guaranteed-departure"
          />
          <TourCarousel
            eyebrow="Premium Selection"
            title="精緻璽品"
            tours={PREMIUM_SELECTION_TOURS}
          />
          <TourCarousel
            eyebrow="Theme Travel"
            title="主題旅遊"
            tours={THEME_TRAVEL_TOURS}
          />
        </section>
        <OurStandards />
        <TestimonialCarousel testimonials={TESTIMONIALS} />
      </main>
      <Footer />
    </div>
  );
}
