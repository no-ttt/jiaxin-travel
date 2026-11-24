import { NextResponse } from "next/server";
import { API_V1_PREFIX, SERVER_API_ORIGIN } from "@/lib/api/config";

/**
 * 本機開發專用的自動登入，.env.local 兩種設定擇一（只在伺服器端讀取，不會進前端程式碼）：
 * - DEV_API_TOKEN：後端核發的開發權杖。連正式站要用這個——正式站的登入 API 在 Cloudflare 信箱驗證後面，
 *   本機的伺服器端請求過不了，但其他後台 API 帶權杖就能用。
 * - DEV_ADMIN_EMAIL／DEV_ADMIN_PASSWORD：向後端登入並轉發 refresh-token cookie（只適用本機後端）。
 * 非開發模式或都沒設定時一律 404。
 */
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const token = process.env.DEV_API_TOKEN;
  if (token) return loginWithToken(token);

  const email = process.env.DEV_ADMIN_EMAIL;
  const password = process.env.DEV_ADMIN_PASSWORD;
  if (!email || !password) {
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

/** 用權杖查 /me 確認還有效，回傳與登入相同的格式（權杖過期時回 401，照常顯示登入頁）。 */
async function loginWithToken(token: string) {
  const res = await fetch(`${SERVER_API_ORIGIN}${API_V1_PREFIX}/admin/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);

  if (!res) return NextResponse.json({ ok: false }, { status: 502 });
  if (!res.ok) return NextResponse.json({ ok: false }, { status: res.status });

  const me = (await res.json()) as { display_name: string; staff_code: string | null };
  return NextResponse.json({
    access_token: token,
    display_name: me.display_name,
    staff_code: me.staff_code,
  });
}
