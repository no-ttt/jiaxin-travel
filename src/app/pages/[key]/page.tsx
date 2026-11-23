import { notFound } from "next/navigation";
import TermsView from "@/components/terms/TermsView";
import { termsTabFromKey } from "@/components/terms/data";
import { STATIC_ANNOUNCEMENTS, STATIC_CANCELLATION_POLICY } from "@/components/terms/staticPolicyPages";
import {
  // 取消／退訂規定、聲明公告專區改為前台寫死，不再從後台讀取。
  // getAnnouncements,
  // getCancellationPolicy,
  getContract,
  getFraudNotice,
  getPurchaseFlow,
} from "@/lib/api/server";

/** 旅客須知及服務條款: /pages/{key} opens that tab (e.g. /pages/contract). */
export default async function TermsPage({ params }: PageProps<"/pages/[key]">) {
  const { key } = await params;
  if (!termsTabFromKey(decodeURIComponent(key))) notFound();

  // Rendered on the server and cached under the 'cms' tag; the backend revalidates it on save.
  const [purchaseFlow, contract, fraudNotice] = await Promise.all([
    getPurchaseFlow().catch(() => null),
    // getCancellationPolicy().catch(() => null),
    getContract().catch(() => null),
    getFraudNotice().catch(() => null),
    // getAnnouncements().catch(() => null),
  ]);
  const cancellationPolicy = STATIC_CANCELLATION_POLICY;
  const announcements = STATIC_ANNOUNCEMENTS;
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
