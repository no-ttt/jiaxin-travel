import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsApi } from "../endpoints/cms";
import type { Homepage } from "../types/cms";

/**
 * Site-wide 後台 content (首頁、選單、頁尾、訂購流程) is shared by every component through this cache
 * and never goes stale on a timer; SiteContentRefresher (app/providers.tsx) re-checks it on each
 * in-site page change, and a reload always gets the latest from the server render.
 */
const SITE_CONTENT_STALE_TIME = Infinity;

/** `initialData` is the server-rendered copy; without it (API was down on the server) the browser fetches. */
export function useHomepage(initialData?: Homepage) {
  return useQuery({
    queryKey: ["public", "homepage"],
    queryFn: () => cmsApi.homepage(),
    staleTime: SITE_CONTENT_STALE_TIME,
    initialData,
  });
}

export function useNavigation() {
  return useQuery({
    queryKey: ["public", "navigation"],
    queryFn: () => cmsApi.navigation(),
    staleTime: SITE_CONTENT_STALE_TIME,
  });
}

export function useFooter() {
  return useQuery({
    queryKey: ["public", "footer"],
    queryFn: () => cmsApi.footer(),
    staleTime: SITE_CONTENT_STALE_TIME,
  });
}

/** 訂購流程; the footer reads `payment.visible` to hide its 匯款資訊 link. */
export function usePurchaseFlow() {
  return useQuery({
    queryKey: ["public", "purchase-flow"],
    queryFn: () => cmsApi.purchaseFlow(),
    staleTime: SITE_CONTENT_STALE_TIME,
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
