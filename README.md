This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API 串接架構

後端是 FastAPI 服務（`https://www.chtravels.com`，OpenAPI 文件在 `/docs`，spec 在 `/openapi.json`），所有業務端點前綴 `/api/v1`，分為 `admin:*`（需要登入）與 `public:*`（免登入）兩大類。

前端串接層集中在 `src/lib/api/`：

```
src/lib/api/
  config.ts          # API_BASE_URL（讀 NEXT_PUBLIC_API_URL，預設 https://www.chtravels.com）
  client.ts           # apiFetch() 核心 fetch wrapper：自動帶 Authorization header、
                       # 401 時觸發 refresh 並重試一次、統一拋出 ApiError
  token-store.ts       # access token 的記憶體 + sessionStorage 存取
  auth-context.tsx     # AuthProvider / useAuth()：登入、登出、掛載時用 refresh cookie 恢復 session
  types/                # 依 OpenAPI schema 手刻的 TypeScript 型別（trip / journey / collection / inquiry / taxonomy / media / cms / auth / common）
  endpoints/            # 純函式，一個資源一個檔，只負責「打哪支 API、帶什麼參數」，不含 React 邏輯
  hooks/                # TanStack Query 的薄封裝（useQuery / useMutation），是元件實際會呼叫的介面
```

### 認證流程

- `POST /admin/auth/login` 換得 `access_token`（存在記憶體 + sessionStorage）＋ httpOnly 的 `chx_refresh` refresh cookie（後端自動下發，前端不需處理）
- 之後每個 `admin:*` 請求都帶 `Authorization: Bearer <access_token>`
- 收到 401 時，`apiFetch` 會自動呼叫 `/admin/auth/refresh`（靠 cookie）換新 token 並重試一次原請求；失敗則視為登出
- `middleware.ts` 會攔截 `/admin/dashboard/**`，檢查一個非 httpOnly 的 `chx_session` 標記 cookie（由 `AuthProvider` 登入成功時設置），沒有的話導回 `/admin/login`

### 資料抓取（TanStack Query）

根 layout 已掛上 `QueryClientProvider`（見 `src/app/providers.tsx`）。串接頁面時直接呼叫 `src/lib/api/hooks/` 底下對應的 hook，例如：

```ts
import { useTripList, useCreateTrip } from "@/lib/api/hooks/useTrips";

const { data, isLoading } = useTripList({ keyword: "京都" });
const createTrip = useCreateTrip();
```

Mutation 成功後會自動 `invalidateQueries` 讓相關的 list/detail 重新抓取，元件端不需要手動管理 loading 或重新整理邏輯。

### 現況與待辦

- 目前所有 admin 頁面（trips、journey-share 等）仍使用各自 `data.ts` 內的假資料，尚未替換成上述 hook——這是刻意分階段進行，架構已就緒可隨時串接
- `types/` 中標註「Provisional read model」的型別是根據後端 request schema 推測的回傳形狀（後端 OpenAPI 目前對 GET 端點沒有宣告明確的 `response_model`），實際串接該資源時應以真實回傳資料校正
- 環境變數範例見 `.env.local.example`（`NEXT_PUBLIC_API_URL`、`NEXT_PUBLIC_TURNSTILE_SITE_KEY`）
