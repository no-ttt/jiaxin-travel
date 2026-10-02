import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { journeysApi } from "../endpoints/journeys";
import type { AlbumReplaceIn, JourneyIn } from "../types/journey";

export function useJourneyList() {
  return useQuery({
    queryKey: ["journeys"],
    queryFn: () => journeysApi.list(),
  });
}

export function useCreateJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: JourneyIn) => journeysApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journeys"] }),
  });
}

export function useUpdateJourney(journeyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<JourneyIn>) => journeysApi.update(journeyId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journeys"] }),
  });
}

export function useDeleteJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (journeyId: string) => journeysApi.remove(journeyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journeys"] }),
  });
}

export function useJourneyAlbum(journeyId: string) {
  return useQuery({
    queryKey: ["journeys", journeyId, "album"],
    queryFn: () => journeysApi.getAlbum(journeyId),
    enabled: Boolean(journeyId),
  });
}

export function useReplaceJourneyAlbum(journeyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AlbumReplaceIn) => journeysApi.replaceAlbum(journeyId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["journeys", journeyId, "album"] }),
  });
}
