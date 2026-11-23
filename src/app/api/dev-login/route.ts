import { NextResponse } from "next/server";
import { API_V1_PREFIX, SERVER_API_ORIGIN } from "@/lib/api/config";

/**
 * 本機開發專用的自動登入：用 .env.local 的 DEV_ADMIN_EMAIL／DEV_ADMIN_PASSWORD 向後端登入，
 * 回傳登入結果並轉發後端的 refresh-token cookie。帳密只在伺服器端讀取，不會進前端程式碼。
 * 非開發模式或沒設定帳密時一律 404。
 */
export async function POST() {
  const email = process.env.DEV_ADMIN_EMAIL;
  const password = process.env.DEV_ADMIN_PASSWORD;
  if (process.env.NODE_ENV !== "development" || !email || !password) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const res = await fetch(`${SERVER_API_ORIGIN}${API_V1_PREFIX}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);

  if (!res) return NextResponse.json({ ok: false }, { status: 502 });

  const out = new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
  for (const cookie of res.headers.getSetCookie()) out.headers.append("Set-Cookie", cookie);
  return out;
}
