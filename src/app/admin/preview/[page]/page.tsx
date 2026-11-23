"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isPreviewKey, usePreviewDraft, type PreviewKey } from "@/components/admin/preview/draft-store";
import { PreviewPage } from "@/components/admin/preview/PreviewPages";

/**
 * 後台「預覽」for the CMS pages: renders the editor's unsaved draft (handed over via localStorage)
 * with the public page's layout, and updates live while the editor tab keeps editing.
 * The URL's last segment is the page key, so the 旅客須知 tabs open on the edited tab.
 */
export default function AdminPreviewPage({ params }: PageProps<"/admin/preview/[page]">) {
  const { page } = use(params);
  if (!isPreviewKey(page)) notFound();
  return <Preview pageKey={page} />;
}

function Preview({ pageKey }: { pageKey: PreviewKey }) {
  const draft = usePreviewDraft<unknown>(pageKey);
  // A cache of its own: the draft is placed where the site's components read their content,
  // and nothing here goes stale or refetches over it.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity, retry: 1, refetchOnWindowFocus: false } },
      })
  );

  if (draft === undefined) return null;
  if (draft === null) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center text-sm text-[#535F71]">
        找不到預覽內容，請從後台編輯頁按「預覽」開啟。
      </div>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <title>預覽｜嘉新旅遊</title>
      {/* Same banner as the trip preview, above the page's own header. */}
      <div className="bg-[#FFF4E5] px-4 py-2 text-center text-sm font-medium text-[#B45309]">
        預覽模式：顯示的是後台尚未儲存的內容，一般訪客看不到。編輯頁修改後會自動更新。
      </div>
      <PreviewPage pageKey={pageKey} draft={draft} />
    </QueryClientProvider>
  );
}
