import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsApi } from "../endpoints/cms";
import type { Homepage } from "../types/cms";

/** `initialData` is the server-rendered copy; without it (API was down on the server) the browser fetches. */
export function useHomepage(initialData?: Homepage) {
  return useQuery({
    queryKey: ["public", "homepage"],
    queryFn: () => cmsApi.homepage(),
    staleTime: 60_000,
    initialData,
  });
}

export function useNavigation() {
  return useQuery({
    queryKey: ["public", "navigation"],
    queryFn: () => cmsApi.navigation(),
    staleTime: 60_000,
  });
}

export function useFooter() {
  return useQuery({
    queryKey: ["public", "footer"],
    queryFn: () => cmsApi.footer(),
    staleTime: 60_000,
  });
}

export function useCmsDocument<T = Record<string, unknown>>(key: string) {
  return useQuery({
    queryKey: ["cms", key],
    queryFn: () => cmsApi.getDocument<T>(key),
    enabled: Boolean(key),
    // Editors reset their draft when a new server copy arrives; a background refetch (window
    // focus / reconnect) after someone else saved would silently discard unsaved edits.
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function usePutCmsDocument<T = Record<string, unknown>>(key: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: T) => cmsApi.putDocument<T>(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", key] });
      queryClient.invalidateQueries({ queryKey: ["public"] });
    },
  });
}
