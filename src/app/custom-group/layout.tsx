import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

/** The page is a client component, so its title／description／share image are set here. */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "客製包團",
    description: "適合家庭、朋友聚會、企業包團與小型私人旅程，由專屬顧問依照成員、預算與期待進行規劃。",
    path: "/custom-group",
  });
}

export default function CustomGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
