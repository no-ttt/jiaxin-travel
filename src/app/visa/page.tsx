import VisaView from "@/components/visa/VisaView";
import { getVisaServices } from "@/lib/api/server";

export default async function VisaPage() {
  // Rendered on the server and cached under the 'cms' tag; the backend revalidates it on save.
  const visaServices = await getVisaServices().catch(() => null);
  return <VisaView visaServices={visaServices} />;
}
