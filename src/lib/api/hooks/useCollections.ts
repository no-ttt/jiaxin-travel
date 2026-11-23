import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { collectionsApi } from "../endpoints/collections";
import type { PublicCollectionParams } from "../types/collection";

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

/**
 * A public collection one page at a time (the API's default page size), for 「查看更多行程」.
 * Changing `params` (filters / sort) starts again from page 1.
 */
export function usePublicCollectionPages(
  slug: string,
  params: Omit<PublicCollectionParams, "page" | "limit"> = {},
) {
  return useInfiniteQuery({
    queryKey: ["public", "collections", slug, "pages", params],
    queryFn: ({ pageParam }) => collectionsApi.publicGet(slug, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((count, page) => count + page.items.length, 0);
      // An empty page means nothing is left, whatever the total says.
      return last.items.length > 0 && loaded < last.total ? last.page + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
