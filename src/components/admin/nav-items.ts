export type AdminNavItem = {
  label: string;
  href: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "官網首頁", href: "/admin/dashboard/homepage" },
  { label: "行程產品管理", href: "/admin/dashboard/trips" },
  { label: "產品分類設定", href: "/admin/dashboard/categories" },
  { label: "簽證代辦", href: "/admin/dashboard/visa" },
  { label: "旅程分享", href: "/admin/dashboard/journey-share" },
  { label: "訂購流程", href: "/admin/dashboard/order-flow" },
  { label: "旅遊契約書", href: "/admin/dashboard/contract" },
  { label: "防詐騙提醒說明", href: "/admin/dashboard/fraud-notice" },
  { label: "網站頁尾設定", href: "/admin/dashboard/footer" },
];
