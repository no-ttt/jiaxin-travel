import TermsView from "@/components/terms/TermsView";
import { getContract, getFraudNotice, getPurchaseFlow } from "@/lib/api/server";

export default async function TermsPage() {
  // Rendered on the server and cached under the 'cms' tag; the backend revalidates it on save.
  const [purchaseFlow, contract, fraudNotice] = await Promise.all([
    getPurchaseFlow().catch(() => null),
    getContract().catch(() => null),
    getFraudNotice().catch(() => null),
  ]);
  return <TermsView purchaseFlow={purchaseFlow} contract={contract} fraudNotice={fraudNotice} />;
}
