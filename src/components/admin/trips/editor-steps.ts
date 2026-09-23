export type EditorStepKey =
  | "cover"
  | "basic"
  | "highlights"
  | "flights"
  | "itinerary"
  | "notice";

export type EditorStep = {
  key: EditorStepKey;
  label: string;
  title: string;
  description: string;
};

export const EDITOR_STEPS: EditorStep[] = [
  {
    key: "cover",
    label: "01 封面",
    title: "① 行程封面設定",
    description: "設定行程封面主圖、副圖與標題樣式；至少填入一張圖片或一段文字。",
  },
  {
    key: "basic",
    label: "02 基本資料",
    title: "② 行程基本資料",
    description: "管理前台標題、識別、價格、訂金、出發日期與團期等實際顯示資訊。",
  },
  {
    key: "highlights",
    label: "03 行程特色",
    title: "③ 行程特色",
    description: "以前台卡面為單位編輯；每張卡可自訂標題、富文字內容，並加入 1 張以上圖片與註解。",
  },
  {
    key: "flights",
    label: "04 航程資訊",
    title: "④ 航程資訊",
    description: "輸入去回程與轉機航段；跨日航班可標記 +1。",
  },
  {
    key: "itinerary",
    label: "05 每日行程",
    title: "⑤ 每日行程",
    description: "每一天可調整順序，並分別填寫行程點、餐食、住宿與景點說明。",
  },
  {
    key: "notice",
    label: "06 訂購須知",
    title: "⑥ 訂購須知",
    description: "預設四個分頁，可自行新增、刪除、排序與控制前台顯示。",
  },
];
