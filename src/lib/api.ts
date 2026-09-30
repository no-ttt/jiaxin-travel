import { cookies, draftMode } from "next/headers";

/**
 * 後端 API 存取（伺服器端專用：Server Component / Route Handler）。
 *
 * - 一般模式：fetch 帶 tags ['cms', ...]，由 Next 快取（ISR）。後台儲存後會呼叫 /api/revalidate 讓 'cms' 過期，
 *   下一個請求就拿到最新內容 → 業主儲存後數秒生效。
 * - 預覽模式（draftMode）：不快取，並帶上後台核發的 X-Preview-Token，可看到草稿行程。
 *
 * 瀏覽器端（client component）請直接用 `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/...`（同源）。
 */
const INTERNAL_BASE = process.env.API_INTERNAL_BASE; // Docker 內網 http://api:8000（伺服器端）
const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_BASE ?? ""; // https://www.chtravels.com（同源）
export const API_BASE = `${INTERNAL_BASE ?? PUBLIC_BASE}/api/v1`;
export const CMS_TAG = "cms";

export class ApiError extends Error {
  constructor(
    public status: number,
    public path: string,
  ) {
    super(`API ${status} ${path}`);
  }
}

export async function apiFetch<T>(
  path: string,
  opts: { tags?: string[]; revalidate?: number } = {},
): Promise<T> {
  const { isEnabled: preview } = await draftMode();
  const headers: Record<string, string> = { accept: "application/json" };
  let init: RequestInit & { next?: { tags?: string[]; revalidate?: number } };
  if (preview) {
    const token = (await cookies()).get("preview_token")?.value;
    if (token) headers["X-Preview-Token"] = token;
    init = { headers, cache: "no-store" };
  } else {
    init = {
      headers,
      next: { tags: [CMS_TAG, ...(opts.tags ?? [])], revalidate: opts.revalidate ?? 3600 },
    };
  }
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) throw new ApiError(res.status, path);
  return (await res.json()) as T;
}
