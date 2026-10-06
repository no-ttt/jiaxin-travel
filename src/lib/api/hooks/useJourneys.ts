import { useQuery } from "@tanstack/react-query";
import { journeysApi } from "../endpoints/journeys";
import type { Album, Journey } from "../types/journey";

export const JOURNEYS_KEY = ["journeys"] as const;
export const JOURNEY_EDITOR_KEY = [...JOURNEYS_KEY, "editor"] as const;

export type JourneyWithAlbum = { journey: Journey; album: Album };

/** Every journey with its album, so the admin editor can diff the whole page on save. */
export async function fetchJourneyEditorData(): Promise<JourneyWithAlbum[]> {
  const journeys = await journeysApi.list();
  const sorted = [...journeys].sort((a, b) => a.position - b.position);
  return Promise.all(
    sorted.map(async (journey) => ({ journey, album: await journeysApi.getAlbum(journey.id) }))
  );
}

export function useJourneyEditorData() {
  return useQuery({ queryKey: JOURNEY_EDITOR_KEY, queryFn: fetchJourneyEditorData });
}

export function usePublicJourneyAlbum(journeyId: string | null) {
  return useQuery({
    queryKey: [...JOURNEYS_KEY, "public", journeyId, "album"],
    queryFn: () => journeysApi.publicAlbum(journeyId!),
    enabled: Boolean(journeyId),
  });
}
