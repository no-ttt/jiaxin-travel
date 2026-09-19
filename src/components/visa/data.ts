import type { ServiceRow } from "./ServiceTable";

export const PASSPORT_ROWS: ServiceRow[] = [
  {
    id: "passport-adult",
    item: "中華民國護照｜14 歲以上",
    validity: "10 年",
    duration: "11 個工作天",
    fee: "NT$ 1,800",
  },
  {
    id: "passport-adult-express",
    item: "中華民國護照｜14 歲以上・特急件",
    validity: "10 年",
    duration: "3 個工作天",
    fee: "NT$ 2,700",
  },
  {
    id: "passport-minor",
    item: "中華民國護照｜未滿 14 歲",
    validity: "5 年",
    duration: "11 個工作天",
    fee: "NT$ 1,400",
  },
  {
    id: "passport-minor-express",
    item: "中華民國護照｜未滿 14 歲・特急件",
    validity: "5 年",
    duration: "3 個工作天",
    fee: "NT$ 2,300",
  },
  {
    id: "passport-reissue",
    item: "護照遺失補發／毀損",
    validity: "5 年",
    duration: "8 個工作天",
    fee: "NT$ 1,800",
  },
];

export const VISA_ROWS: ServiceRow[] = [
  {
    id: "visa-china",
    item: "中國台胞證｜五年期",
    validity: "5 年",
    duration: "專員確認",
    fee: "專員報價",
  },
  {
    id: "visa-japan",
    item: "日本｜依入境身分確認",
    validity: "依規定",
    duration: "專員確認",
    fee: "專員報價",
  },
  {
    id: "visa-korea",
    item: "韓國｜依入境身分確認",
    validity: "依規定",
    duration: "專員確認",
    fee: "專員報價",
  },
  {
    id: "visa-thailand",
    item: "泰國｜依最新簽證規定",
    validity: "依規定",
    duration: "專員確認",
    fee: "專員報價",
  },
  {
    id: "visa-vietnam",
    item: "越南｜電子簽證",
    validity: "依核准內容",
    duration: "專員確認",
    fee: "專員報價",
  },
  {
    id: "visa-us",
    item: "美國｜ESTA／美簽",
    validity: "依核准類型",
    duration: "專員確認",
    fee: "專員報價",
  },
  {
    id: "visa-canada",
    item: "加拿大｜電子旅行授權／簽證",
    validity: "依核准類型",
    duration: "專員確認",
    fee: "專員報價",
  },
  {
    id: "visa-australia",
    item: "澳洲｜ETA／簽證",
    validity: "依核准類型",
    duration: "專員確認",
    fee: "專員報價",
  },
  {
    id: "visa-nz",
    item: "紐西蘭｜NZeTA／簽證",
    validity: "依核准類型",
    duration: "專員確認",
    fee: "專員報價",
  },
];
