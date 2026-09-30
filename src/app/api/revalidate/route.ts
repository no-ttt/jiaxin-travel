import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { CMS_TAG } from "@/lib/api";

/**
 * 後端在後台儲存後呼叫（Docker 內網 http://frontend:3000/api/revalidate，帶 x-revalidate-secret）。
 * 把指定 tag（預設 'cms'）的快取設為過期；下一個請求即重新向 API 取資料渲染。
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { tags?: unknown; reason?: unknown };
  const tags =
    Array.isArray(body.tags) && body.tags.length > 0
      ? body.tags.filter((t): t is string => typeof t === "string")
      : [CMS_TAG];
  for (const tag of tags) revalidateTag(tag, "max");
  return NextResponse.json({ ok: true, tags, reason: body.reason ?? null, at: new Date().toISOString() });
}
