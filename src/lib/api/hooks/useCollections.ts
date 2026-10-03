import { useQuery } from "@tanstack/react-query";
import { collectionsApi } from "../endpoints/collections";

export const collectionKey = (collectionId: number) => ["collections", collectionId] as const;

export function useCollection(collectionId: number | null) {
  return useQuery({
    queryKey: collectionKey(collectionId ?? 0),
    queryFn: () => collectionsApi.get(collectionId!),
    enabled: collectionId != null,
  });
}

/** Published trips matching a 團號／團名 query; idle while the query is blank. */
export function useCollectionTripSearch(collectionId: number | null, q: string) {
  const query = q.trim();
  return useQuery({
    queryKey: ["collections", collectionId, "trip-search", query],
    queryFn: () => collectionsApi.searchTripsForCollection(collectionId!, query),
    enabled: collectionId != null && query.length > 0,
    staleTime: 30_000,
  });
}
