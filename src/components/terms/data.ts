/** Tab ids are the backend page keys, so each tab's URL is /pages/{key} (as in the backend sitemap). */
export type TermsTabId = "purchase-flow" | "cancellation-policy" | "contract" | "fraud-notice" | "announcements";

export type TermsTab = {
  id: TermsTabId;
  label: string;
};

export const TERMS_TABS: TermsTab[] = [
  { id: "purchase-flow", label: "訂購流程" },
  { id: "cancellation-policy", label: "取消／退訂規定" },
  { id: "contract", label: "旅遊契約書" },
  { id: "fraud-notice", label: "防詐騙提醒說明" },
  { id: "announcements", label: "聲明公告專區" },
];

/** The 匯款資訊 block in 訂購流程; /pages/payment-info opens that tab and scrolls to it. */
export const PAYMENT_INFO_KEY = "payment-info";

/** Extra /pages/{key} URLs (the backend's default footer links) and the tab each one opens. */
const KEY_ALIASES: Record<string, TermsTabId> = {
  "terms-and-notice": "purchase-flow",
  [PAYMENT_INFO_KEY]: "purchase-flow",
};

export function termsTabFromKey(key: string | undefined): TermsTabId | null {
  if (!key) return null;
  if (TERMS_TABS.some((tab) => tab.id === key)) return key as TermsTabId;
  return KEY_ALIASES[key] ?? null;
}

export const termsTabHref = (id: TermsTabId) => `/pages/${id}`;
