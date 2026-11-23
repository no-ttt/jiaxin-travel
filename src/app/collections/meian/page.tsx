import MeianView from "@/components/meian/MeianView";
import { getPublicCollection } from "@/lib/api/server";

const COLLECTION_SLUG = "meian";

/** 美安專區: trips checked 美安專區 and published in the admin (GET /public/collections/meian). */
export default async function MeianPage() {
  const collection = await getPublicCollection(COLLECTION_SLUG).catch(() => null);
  return <MeianView collection={collection} />;
}
