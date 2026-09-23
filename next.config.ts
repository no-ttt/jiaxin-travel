import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 伺服器模式（ISR）：後端管線以 deploy/frontend/Dockerfile 建成映像，在 VPS 以 node server.js 執行。
  // 內容由後台儲存後即時 revalidate（/api/revalidate），不再需要整站重建。
  output: "standalone",
  // 圖片變體（thumb/card/hero WebP）由後端產生並放在 CDN，不用 Next 的圖片最佳化（主機只有 1 vCPU）。
  images: { unoptimized: true },
  // 本機開發（npm run dev）：把 /api/v1/* 轉給正式 API，瀏覽器看起來是同源，不需要 CORS。
  // 正式環境由 Caddy 分流 /api/v1/*，這段不生效。可用 DEV_API_ORIGIN 改成其他後端。
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    const origin = process.env.DEV_API_ORIGIN ?? "https://www.chtravels.com";
    return [{ source: "/api/v1/:path*", destination: `${origin}/api/v1/:path*` }];
  },
};

export default nextConfig;
