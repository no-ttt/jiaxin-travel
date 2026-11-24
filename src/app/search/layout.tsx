import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

/** The page is a client component, so its title／description／share image are set here. */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "搜尋行程",
    description: "依目的地、出發日期、天數與預算，搜尋嘉新旅遊的國外團體與主題旅遊行程。",
    path: "/search",
  });
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
