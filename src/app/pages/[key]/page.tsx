import { notFound } from "next/navigation";
import TermsView from "@/components/terms/TermsView";
import { termsTabFromKey } from "@/components/terms/data";
import {
  getAnnouncements,
  getCancellationPolicy,
  getContract,
  getFraudNotice,
  getPurchaseFlow,
} from "@/lib/api/server";

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
