import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * 預覽模式入口：後台「預覽」按鈕開啟 /api/preview?token=<後端核發>&redirect=/trips/XXX
 * 1. 向後端驗證權杖（避免任意人開啟預覽模式）
 * 2. 開啟 Next draftMode，並把權杖放進 httpOnly cookie，之後 apiFetch 會帶 X-Preview-Token 且不快取
 * 3. 導向目標頁
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const redirect = url.searchParams.get("redirect") ?? "/";
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });

  const base = process.env.API_INTERNAL_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? "";
  const check = await fetch(`${base}/api/v1/public/preview/verify`, {
    headers: { "X-Preview-Token": token },
    cache: "no-store",
  });
  if (!check.ok) return NextResponse.json({ error: "invalid or expired token" }, { status: 401 });

  (await draftMode()).enable();
  const target = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
  const res = NextResponse.redirect(new URL(target, url.origin));
  res.cookies.set("preview_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    path: "/",
    maxAge: 60 * 60,
  });
  return res;
}
