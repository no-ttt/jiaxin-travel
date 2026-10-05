export type TermsTabId =
  | "booking-process"
  | "cancellation-policy"
  | "travel-contract"
  | "fraud-alert"
  | "announcements";

export type TermsTab = {
  id: TermsTabId;
  label: string;
  /** Link tabs open a URL instead of showing content on this page (URLs to be filled in later). */
  href?: string;
};

export const TERMS_TABS: TermsTab[] = [
  { id: "booking-process", label: "訂購流程" },
  { id: "cancellation-policy", label: "取消／退訂規定", href: "#" },
  { id: "travel-contract", label: "旅遊契約書" },
  { id: "fraud-alert", label: "防詐騙提醒說明" },
  { id: "announcements", label: "聲明公告專區", href: "#" },
];
