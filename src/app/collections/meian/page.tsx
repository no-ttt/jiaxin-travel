import type { Metadata } from "next";
import MeianView from "@/components/meian/MeianView";
import { getPublicCollection } from "@/lib/api/server";
import { pageMetadata } from "@/lib/seo";

const COLLECTION_SLUG = "meian";

export async function generateMetadata(): Promise<Metadata> {
  const collection = await getPublicCollection(COLLECTION_SLUG).catch(() => null);
  const hero = collection?.hero;
  return pageMetadata({
    title: collection?.title || "美安專區",
    // The page's own subtitle (後台文案); the hero's design copy otherwise.
    description: collection?.subtitle || "美安會員專屬精選旅遊",
    path: "/collections/meian",
    image: hero ? (hero.variants.hero ?? hero.url) : null,
  });
}

/** 美安專區: trips checked 美安專區 and published in the admin (GET /public/collections/meian). */
export default async function MeianPage() {
  const collection = await getPublicCollection(COLLECTION_SLUG).catch(() => null);
  return <MeianView collection={collection} />;
}
