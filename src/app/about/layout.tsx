import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

/** The page is a client component, so its title／description／share image are set here. */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "關於我們",
    description: "深耕旅遊產業 30 年，我們用豐富的在地經驗與扎實的專業，為每位旅客把關旅程中的所有細節。",
    path: "/about",
    image: "/images/about-hero.png",
  });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
