import type { Metadata } from "next";
import JourneyShareView from "@/components/journey-share/JourneyShareView";
import { getPublicJourneys } from "@/lib/api/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "旅程分享",
    description: "那些一起出發、一起笑過的瞬間，才是旅程最值得留下的風景。",
    path: "/journeys",
  });
}

export default async function JourneySharePage() {
  // Rendered on the server and cached under the 'cms' tag; the backend revalidates it on save.
  const journeys = await getPublicJourneys().catch(() => null);
  return <JourneyShareView journeys={journeys} />;
}
