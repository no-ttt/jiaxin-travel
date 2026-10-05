import type { VisaNoticeDoc, VisaServiceDetail } from "@/lib/api/types/cms";

/** Rich-text output counts as empty when it holds only tags / &nbsp; (e.g. "<p><br></p>"). */
export const isBlankHtml = (html: string) => html.replace(/<[^>]*>|&nbsp;/g, "").trim() === "";

/** 辦證須知 documents; until the backend stores `notice_docs`, the legacy `notice_html` is one block. */
export function noticeDocsOf(detail: VisaServiceDetail): VisaNoticeDoc[] {
  if (detail.notice_docs) return detail.notice_docs;
  return isBlankHtml(detail.notice_html) ? [] : [{ title: "", body_html: detail.notice_html }];
}
