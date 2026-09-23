export type SidebarCategory = {
  id: string;
  name: string;
  hasSubmenu: boolean;
  submenuEnabled: boolean;
  linkUrl: string;
  submenuNote: string;
};

export const INITIAL_SIDEBAR_CATEGORIES: SidebarCategory[] = [
  {
    id: "cat-1",
    name: "國外團體",
    hasSubmenu: true,
    submenuEnabled: true,
    linkUrl: "",
    submenuNote: "已啟用，地區子分類請於下方「國外團體地區子分類管理」區塊編輯。",
  },
  {
    id: "cat-2",
    name: "精緻璽品",
    hasSubmenu: true,
    submenuEnabled: false,
    linkUrl: "",
    submenuNote: "如需改用子選單，開啟後內容請於下方「精緻璽品子分類管理」區塊設定。",
  },
  {
    id: "cat-3",
    name: "主題旅遊",
    hasSubmenu: true,
    submenuEnabled: true,
    linkUrl: "",
    submenuNote: "已啟用，子類別請於下方「主題旅遊子類別名稱」區塊編輯。",
  },
  { id: "cat-4", name: "客製包團", hasSubmenu: false, submenuEnabled: false, linkUrl: "", submenuNote: "" },
  { id: "cat-5", name: "美安專區", hasSubmenu: false, submenuEnabled: false, linkUrl: "", submenuNote: "" },
  { id: "cat-6", name: "機票", hasSubmenu: false, submenuEnabled: false, linkUrl: "", submenuNote: "" },
  { id: "cat-7", name: "簽證", hasSubmenu: false, submenuEnabled: false, linkUrl: "", submenuNote: "" },
  { id: "cat-8", name: "旅客服務", hasSubmenu: false, submenuEnabled: false, linkUrl: "", submenuNote: "" },
  { id: "cat-9", name: "旅程分享", hasSubmenu: false, submenuEnabled: false, linkUrl: "", submenuNote: "" },
];

export type RegionSubcategory = {
  id: string;
  name: string;
};

export const INITIAL_REGION_SUBCATEGORIES: RegionSubcategory[] = [
  { id: "region-1", name: "日本" },
  { id: "region-2", name: "韓國" },
  { id: "region-3", name: "中國" },
  { id: "region-4", name: "港澳" },
  { id: "region-5", name: "東南亞" },
  { id: "region-6", name: "紐澳" },
  { id: "region-7", name: "歐洲" },
  { id: "region-8", name: "美加" },
  { id: "region-9", name: "中東非洲" },
];

export type LuxurySubcategory = {
  id: string;
  name: string;
  visible: boolean;
};

export const INITIAL_LUXURY_SUBCATEGORIES: LuxurySubcategory[] = [];

export type ThemeSubcategory = {
  id: string;
  name: string;
  visible: boolean;
  pageLabel: string;
};

export const INITIAL_THEME_SUBCATEGORIES: ThemeSubcategory[] = [
  { id: "theme-1", name: "賽車", visible: true, pageLabel: "《賽車》主題集合頁" },
  { id: "theme-2", name: "郵輪", visible: true, pageLabel: "《郵輪》主題集合頁" },
  { id: "theme-3", name: "鐵道", visible: true, pageLabel: "《鐵道》主題集合頁" },
  { id: "theme-4", name: "山林", visible: true, pageLabel: "《山林》主題集合頁" },
  { id: "theme-5", name: "滑雪", visible: true, pageLabel: "《滑雪》主題集合頁" },
  { id: "theme-6", name: "馬拉松", visible: true, pageLabel: "《馬拉松》主題集合頁" },
  { id: "theme-7", name: "單車", visible: false, pageLabel: "《單車》主題集合頁" },
  { id: "theme-8", name: "登山健行", visible: true, pageLabel: "《登山健行》主題集合頁" },
  { id: "theme-9", name: "高爾夫", visible: true, pageLabel: "《高爾夫》主題集合頁" },
];
