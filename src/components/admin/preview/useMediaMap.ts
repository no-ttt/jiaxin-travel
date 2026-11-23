"use client";

import { useQueries } from "@tanstack/react-query";
import { mediaApi } from "@/lib/api/endpoints/media";
import { mediaKey } from "@/lib/api/hooks/useMedia";
import type { Media } from "@/lib/api/types/media";

/** Media objects for the ids a draft refers to (the public API would have resolved them). */
export function useMediaMap(ids: (string | null | undefined)[]) {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  const results = useQueries({
    queries: unique.map((id) => ({ queryKey: mediaKey(id), queryFn: () => mediaApi.get(id), staleTime: Infinity })),
  });
  const map = new Map<string, Media>();
  results.forEach((result) => {
    if (result.data) map.set(result.data.id, result.data);
  });
  return (id: string | null | undefined): Media | null => (id ? (map.get(id) ?? null) : null);
}
