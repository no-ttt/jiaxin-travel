import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionsApi } from "../endpoints/collections";
import type { AddTripIn, CollectionUpdate, ReorderIn } from "../types/collection";

export function useCollection(collectionId: string) {
  return useQuery({
    queryKey: ["collections", collectionId],
    queryFn: () => collectionsApi.get(collectionId),
    enabled: Boolean(collectionId),
  });
}

export function useUpdateCollection(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CollectionUpdate) => collectionsApi.update(collectionId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections", collectionId] }),
  });
}

export function useAddTripToCollection(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddTripIn) => collectionsApi.addTrip(collectionId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections", collectionId] }),
  });
}

export function useReorderCollectionItems(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderIn) => collectionsApi.reorder(collectionId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections", collectionId] }),
  });
}

export function useRemoveTripFromCollection(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tripId: string) => collectionsApi.removeTrip(collectionId, tripId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections", collectionId] }),
  });
}
