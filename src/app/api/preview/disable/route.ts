import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/** 關閉預覽模式：清掉 draftMode 與權杖 cookie，回到正式內容。 */
export async function GET(req: Request) {
  (await draftMode()).disable();
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL(url.searchParams.get("redirect") ?? "/", url.origin));
  res.cookies.delete("preview_token");
  return res;
}
