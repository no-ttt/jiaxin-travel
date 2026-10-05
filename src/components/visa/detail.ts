import type { VisaNoticeDoc, VisaServiceDetail } from "@/lib/api/types/cms";
import { isBlankHtml } from "@/lib/html";

export { isBlankHtml };

/** 辦證須知 documents; until the backend stores `notice_docs`, the legacy `notice_html` is one block. */
export function noticeDocsOf(detail: VisaServiceDetail): VisaNoticeDoc[] {
  if (detail.notice_docs) return detail.notice_docs;
  return isBlankHtml(detail.notice_html) ? [] : [{ title: "", body_html: detail.notice_html }];
}
