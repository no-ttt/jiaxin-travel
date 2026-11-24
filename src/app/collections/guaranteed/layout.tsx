import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getPublicCollection } from "@/lib/api/server";

/** The page is a client component, so its title／description／share image are set here. */
export async function generateMetadata(): Promise<Metadata> {
  const collection = await getPublicCollection("guaranteed").catch(() => null);
  const hero = collection?.hero;
  return pageMetadata({
    title: collection?.title || "保證出團",
    description: collection?.subtitle,
    path: "/collections/guaranteed",
    image: hero ? (hero.variants.hero ?? hero.url) : "/images/guaranteed-hero.png",
  });
}

export default function GuaranteedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
