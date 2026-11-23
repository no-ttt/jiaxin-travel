import { useQuery } from "@tanstack/react-query";
import { journeysApi } from "../endpoints/journeys";
import type { Album, Journey } from "../types/journey";

export const JOURNEYS_KEY = ["journeys"] as const;
export const JOURNEY_EDITOR_KEY = [...JOURNEYS_KEY, "editor"] as const;

/** Journeys in display order (one request); each album loads when its tab is opened (useAdminJourneyAlbum). */
export async function fetchJourneyEditorData(): Promise<Journey[]> {
  const journeys = await journeysApi.list();
  return [...journeys].sort((a, b) => a.position - b.position);
}

export const ADMIN_JOURNEY_ALBUM_KEY = [...JOURNEYS_KEY, "admin-album"] as const;

/** One journey's album for the admin editor; `journeyId` null (new / already loaded) skips the request. */
export function useAdminJourneyAlbum(journeyId: string | null) {
  return useQuery({
    queryKey: [...ADMIN_JOURNEY_ALBUM_KEY, journeyId],
    queryFn: async (): Promise<{ journeyId: string; album: Album }> => ({
      journeyId: journeyId!,
      album: await journeysApi.getAlbum(journeyId!),
    }),
    enabled: Boolean(journeyId),
  });
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
