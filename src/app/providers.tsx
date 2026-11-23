"use client";

import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Site-wide 後台 content kept in the browser cache (see SITE_CONTENT_STALE_TIME in useCms). */
const SITE_CONTENT_KEYS = ["homepage", "navigation", "footer", "purchase-flow"];

/**
 * On every in-site page change, re-checks the site-wide content in the background: the cached copy
 * shows instantly and is swapped for the new one only if it changed. The first load is skipped
 * because the server just rendered it fresh (no duplicate request).
 */
function SiteContentRefresher() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    // Only queries the new page actually shows are refetched (refetchType "active" by default).
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "public" && SITE_CONTENT_KEYS.includes(String(query.queryKey[1])),
    });
  }, [pathname, queryClient]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SiteContentRefresher />
      {children}
    </QueryClientProvider>
  );
}
