import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

/** The page is a client component, so its title／description／share image are set here. */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "行程洽詢",
    description: "請留下您的聯絡方式，我們將盡快為您安排行程諮詢。",
    path: "/contact",
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
