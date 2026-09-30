import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_CSS} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
