import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getFooter, getNavigation, getPurchaseFlow } from "@/lib/api/server";
import "./globals.css";
import { Providers } from "./providers";

// 字型改由瀏覽器從 Google Fonts 載入，不在建置時下載。
// 原本用 next/font/google 會在 next build 時抓字型檔；自 2026-09-27 起 GitHub 建置機器抓到的回應
// 讓 Turbopack 解析失敗（216 個 "next/font/google queries have exactly one entry"），整站無法部署。
// 字型家族名稱對應 globals.css 的 --font-noto-sans-tc／--font-noto-serif-tc。
const GOOGLE_FONTS_CSS =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=Noto+Serif+TC:wght@600;700&display=swap";

export const metadata: Metadata = {
  title: "嘉新旅遊",
  description: "嘉新旅遊官方網站",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Header/Footer/Sidebar read navigation and footer through React Query hooks; seeding the
  // cache here puts that content in the server-rendered HTML. A failed prefetch is skipped
  // (prefetchQuery never throws) and the browser fetches it as before.
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ["public", "navigation"], queryFn: getNavigation }),
    queryClient.prefetchQuery({ queryKey: ["public", "footer"], queryFn: getFooter }),
    // The footer hides its 匯款資訊 link while 訂購流程's payment block is switched off.
    queryClient.prefetchQuery({ queryKey: ["public", "purchase-flow"], queryFn: getPurchaseFlow }),
  ]);

  return (
    // Smooth scrolling for in-page anchors (e.g. /terms#payment-info). data-scroll-behavior lets
    // Next.js switch it off during route changes so page navigation still jumps to the top instantly.
    <html lang="zh-Hant" className="h-full antialiased motion-safe:scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_CSS} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
