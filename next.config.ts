import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 伺服器模式：後端管線以 deploy/frontend/Dockerfile 建成映像，在 VPS 以 node server.js 執行。
  output: "standalone",
  // 圖片變體（thumb/card/hero WebP）由後端產生並放在 CDN，不用 Next 的圖片最佳化（主機只有 1 vCPU）。
  images: { unoptimized: true },
  // 行程頁由 /search/<行程代碼> 搬到 /trips/<行程代碼>；舊網址（已分享出去的連結）永久轉址。
  async redirects() {
    return [{ source: "/search/:id", destination: "/trips/:id", permanent: true }];
  },
  // 本機開發（npm run dev）：把 /api/v1/* 轉給正式 API，瀏覽器看起來是同源，不需要 CORS，
  // refresh-token cookie 也維持第一方。正式環境由 Caddy 分流 /api/v1/*，這段不生效。
  // 位址的備援順序與 src/lib/api/config.ts 相同（另外可用 DEV_API_ORIGIN 指定），並去掉結尾斜線。
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    const origin = (
      process.env.DEV_API_ORIGIN ??
      process.env.NEXT_PUBLIC_API_BASE ??
      process.env.NEXT_PUBLIC_API_URL ??
      "https://www.chtravels.com"
    ).replace(/\/+$/, "");
    return [{ source: "/api/v1/:path*", destination: `${origin}/api/v1/:path*` }];
  },
};

export default nextConfig;
