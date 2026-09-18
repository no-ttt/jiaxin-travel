import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 伺服器模式（ISR）：後端管線以 deploy/frontend/Dockerfile 建成映像，在 VPS 以 node server.js 執行。
  // 內容由後台儲存後即時 revalidate（/api/revalidate），不再需要整站重建。
  output: "standalone",
  // 圖片變體（thumb/card/hero WebP）由後端產生並放在 CDN，不用 Next 的圖片最佳化（主機只有 1 vCPU）。
  images: { unoptimized: true },
};

export default nextConfig;
