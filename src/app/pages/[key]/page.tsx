import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TermsView from "@/components/terms/TermsView";
import { TERMS_TABS, termsTabFromKey } from "@/components/terms/data";
import {
  getAnnouncements,
  getCancellationPolicy,
  getContract,
  getFraudNotice,
  getPurchaseFlow,
} from "@/lib/api/server";
import { pageMetadata } from "@/lib/seo";

/** Each tab is its own page title (「取消／退訂規定｜嘉新旅遊」). */
export async function generateMetadata({ params }: PageProps<"/pages/[key]">): Promise<Metadata> {
  const key = decodeURIComponent((await params).key);
  const tab = TERMS_TABS.find((t) => t.id === termsTabFromKey(key));
  if (!tab) return { title: "找不到頁面｜嘉新旅遊" };
  return pageMetadata({
    title: tab.label,
    description: "專業快速，出發前先了解重要資訊，讓每段旅程都能安心、順利地開始。",
    path: `/pages/${encodeURIComponent(key)}`,
    image: "/images/terms-hero-bg.png",
  });
}

/** 旅客須知及服務條款: /pages/{key} opens that tab (e.g. /pages/contract). */
export default async function TermsPage({ params }: PageProps<"/pages/[key]">) {
  const { key } = await params;
  if (!termsTabFromKey(decodeURIComponent(key))) notFound();

  // Rendered on the server and cached under the 'cms' tag; the backend revalidates it on save.
  const [purchaseFlow, cancellationPolicy, contract, fraudNotice, announcements] = await Promise.all([
    getPurchaseFlow().catch(() => null),
    getCancellationPolicy().catch(() => null),
    getContract().catch(() => null),
    getFraudNotice().catch(() => null),
    getAnnouncements().catch(() => null),
  ]);
  return (
    <TermsView
      purchaseFlow={purchaseFlow}
      cancellationPolicy={cancellationPolicy}
      contract={contract}
      fraudNotice={fraudNotice}
      announcements={announcements}
    />
  );
}
