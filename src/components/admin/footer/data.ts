export type BrandInfo = {
  nameZh: string;
  nameEn: string;
  legalInfo: string;
};

export type ContactInfo = {
  phone: string;
  email: string;
  address: string;
  lineUrl: string;
  facebookUrl: string;
  instagramUrl: string;
};

export type FooterLink = {
  id: string;
  label: string;
  url: string;
};

export type CopyrightInfo = {
  copyrightText: string;
  links: FooterLink[];
};

export const INITIAL_BRAND_INFO: BrandInfo = {
  nameZh: "嘉新旅遊",
  nameEn: "Chia Hsin Travel",
  legalInfo:
    "嘉新旅遊股份有限公司（甲種旅行社）\n代表人：王小明　｜　統一編號：12345678\n交觀甲 第1234號　｜　品保北 1234號",
};

export const INITIAL_CONTACT_INFO: ContactInfo = {
  phone: "03-3373577",
  email: "service@chiahsin.com.tw",
  address: "330 桃園市桃園區三民路三段 170 號",
  lineUrl: "https://line.me/R/ti/p/@chiahsin",
  facebookUrl: "https://facebook.com/chiahsintravel",
  instagramUrl: "https://instagram.com/chiahsintravel",
};

export const INITIAL_COPYRIGHT_INFO: CopyrightInfo = {
  copyrightText: "Copyright © 2026 Chia Hsin Travel. All rights reserved.",
  links: [
    { id: "link-1", label: "匯款資訊", url: "/pages/payment-info" },
    { id: "link-2", label: "旅客須知及服務條款", url: "/pages/terms-and-notice" },
  ],
};
