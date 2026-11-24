import type { Metadata } from "next";
import VisaView from "@/components/visa/VisaView";
import { getVisaServices } from "@/lib/api/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "護照及簽證代辦服務",
    description: "先查天數與費用，備妥文件後直接聯繫專員辦理。",
    path: "/visa-services",
    image: "/images/visa-hero-bg.png",
  });
}

export default async function VisaPage() {
  // Rendered on the server and cached under the 'cms' tag; the backend revalidates it on save.
  const visaServices = await getVisaServices().catch(() => null);
  return <VisaView visaServices={visaServices} />;
}
