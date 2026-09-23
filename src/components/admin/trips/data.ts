export type TripStatus = "published" | "unpublished" | "draft";

export type TripKind = "custom" | "external";

export type TripRow = {
  id: string;
  name: string;
  kind: TripKind;
  region: string;
  themes: string[];
  zone: string;
  days: number;
  duration: string;
  priceFrom: string;
  priceValue: number;
  status: TripStatus;
  lastEditedLabel: string;
  lastEditedMinutesAgo: number;
};

export type FilterGroupKey =
  | "region"
  | "theme"
  | "zone"
  | "kind"
  | "status"
  | "days";

export type FilterOption = {
  value: string;
  label: string;
};

export const FILTER_GROUPS: Record<FilterGroupKey, { label: string; options: FilterOption[] }> = {
  region: {
    label: "地區",
    options: [
      { value: "japan", label: "日本" },
      { value: "korea", label: "韓國" },
      { value: "europe", label: "歐洲" },
      { value: "southeast-asia", label: "東南亞" },
    ],
  },
  theme: {
    label: "主題",
    options: [
      { value: "maple", label: "賞楓" },
      { value: "hot-spring", label: "溫泉" },
      { value: "art", label: "藝術巡禮" },
      { value: "cycling", label: "單車輕旅" },
    ],
  },
  zone: {
    label: "所屬專區",
    options: [
      { value: "guaranteed-departure", label: "保證出團" },
      { value: "custom-trip", label: "客製旅遊" },
    ],
  },
  kind: {
    label: "行程類型",
    options: [
      { value: "custom", label: "自建" },
      { value: "external", label: "外部連結" },
    ],
  },
  status: {
    label: "上下架狀態",
    options: [
      { value: "published", label: "已上架" },
      { value: "unpublished", label: "已下架" },
      { value: "draft", label: "草稿" },
    ],
  },
  days: {
    label: "天數區間",
    options: [
      { value: "1-5", label: "1-5 天" },
      { value: "6-10", label: "6-10 天" },
      { value: "11+", label: "11 天以上" },
    ],
  },
};

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  published: "已上架",
  unpublished: "已下架",
  draft: "草稿",
};

export const TRIP_STATUS_STYLE: Record<TripStatus, string> = {
  published: "bg-[#E3F3E5] text-[#1A7F37]",
  unpublished: "bg-[#EDEEF0] text-[#535F71]",
  draft: "bg-[#FDEDD6] text-[#B45309]",
};

export const TRIP_KIND_LABEL: Record<TripKind, string> = {
  custom: "自建",
  external: "外部連結",
};

export const TRIP_KIND_STYLE: Record<TripKind, string> = {
  custom: "bg-[#0053E0] text-white",
  external: "bg-[#EDEEF0] text-[#535F71]",
};

export const MOCK_TRIPS: TripRow[] = [
  {
    id: "1",
    name: "追尋極光・遇見冰島 10 日",
    kind: "custom",
    region: "europe",
    themes: ["hot-spring"],
    zone: "guaranteed-departure",
    days: 10,
    duration: "10天9夜",
    priceFrom: "NT$ 168,000 起",
    priceValue: 168000,
    status: "published",
    lastEditedLabel: "2 小時前",
    lastEditedMinutesAgo: 120,
  },
  {
    id: "2",
    name: "北歐四國超值選 13 日",
    kind: "custom",
    region: "europe",
    themes: ["art"],
    zone: "guaranteed-departure",
    days: 13,
    duration: "13天11夜",
    priceFrom: "NT$ 159,900 起",
    priceValue: 159900,
    status: "published",
    lastEditedLabel: "5 小時前",
    lastEditedMinutesAgo: 300,
  },
  {
    id: "3",
    name: "富士之巔・藝術巡禮",
    kind: "external",
    region: "japan",
    themes: ["art", "maple"],
    zone: "custom-trip",
    days: 5,
    duration: "5天4夜",
    priceFrom: "NT$ 42,000 起",
    priceValue: 42000,
    status: "unpublished",
    lastEditedLabel: "1 天前",
    lastEditedMinutesAgo: 1440,
  },
  {
    id: "4",
    name: "義法瑞歐洲三國 10 日",
    kind: "custom",
    region: "europe",
    themes: ["art"],
    zone: "guaranteed-departure",
    days: 10,
    duration: "10天8夜",
    priceFrom: "NT$ 128,000 起",
    priceValue: 128000,
    status: "draft",
    lastEditedLabel: "3 天前",
    lastEditedMinutesAgo: 4320,
  },
  {
    id: "5",
    name: "泰北清邁單車輕旅",
    kind: "external",
    region: "southeast-asia",
    themes: ["cycling"],
    zone: "custom-trip",
    days: 6,
    duration: "6天5夜",
    priceFrom: "NT$ 35,900 起",
    priceValue: 35900,
    status: "published",
    lastEditedLabel: "6 天前",
    lastEditedMinutesAgo: 8640,
  },
  {
    id: "6",
    name: "京都嵐山賞楓 6 日",
    kind: "custom",
    region: "japan",
    themes: ["maple", "hot-spring"],
    zone: "guaranteed-departure",
    days: 6,
    duration: "6天5夜",
    priceFrom: "NT$ 49,900 起",
    priceValue: 49900,
    status: "published",
    lastEditedLabel: "8 小時前",
    lastEditedMinutesAgo: 480,
  },
  {
    id: "7",
    name: "首爾釜山雙城 5 日",
    kind: "external",
    region: "korea",
    themes: ["hot-spring"],
    zone: "custom-trip",
    days: 5,
    duration: "5天4夜",
    priceFrom: "NT$ 32,900 起",
    priceValue: 32900,
    status: "published",
    lastEditedLabel: "2 天前",
    lastEditedMinutesAgo: 2880,
  },
];
