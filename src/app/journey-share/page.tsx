import JourneyShareView from "@/components/journey-share/JourneyShareView";
import { getPublicJourneys } from "@/lib/api/server";

export default async function JourneySharePage() {
  // Rendered on the server and cached under the 'cms' tag; the backend revalidates it on save.
  const journeys = await getPublicJourneys().catch(() => null);
  return <JourneyShareView journeys={journeys} />;
}
