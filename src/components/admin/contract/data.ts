export type PageIntro = {
  pageTitle: string;
  description: string;
};

export type ContractDocument = {
  documentTitle: string;
  linkText: string;
  fileUrl: string;
};

export type ContractClause = {
  id: string;
  title: string;
  content: string;
};

export const INITIAL_PAGE_INTRO: PageIntro = {
  pageTitle: "旅遊契約與權益說明",
  description:
    "<p>為保障您的出國旅遊權益，本公司所有國外團體行程與國外專屬客製包團服務，皆嚴格遵守交通部觀光署頒布之《國外旅遊定型化契約範本》。</p>",
};

export const INITIAL_DOCUMENT: ContractDocument = {
  documentTitle: "國外旅遊定型化契約書 (觀光署標準範本)",
  linkText: "國外旅遊定型化契約書下載",
  fileUrl: "https://example.com/files/contract-template.pdf",
};

export const INITIAL_CLAUSES: ContractClause[] = [
  {
    id: "clause-1",
    title: "契約成立與生效條件",
    content:
      "<p>由於本公司行程（含客製包團與精選國外團體）需由專人為您確認機位、飯店名額或專屬行程規劃，送出預約或諮詢需求時契約尚未生效。</p><p>當專屬旅遊顧問為您確認行程/名額無誤，且您完成訂金支付後，旅遊契約即正式成立生效。</p>",
  },
  {
    id: "clause-2",
    title: "重要條款摘要",
    content:
      "<p>1. 費用涵蓋與自費項目<br/>團費包含：國際機票、行程表中標示之住宿與餐食、景點門票、團體陸上交通、旅行業責任保險。<br/>團費不含：護照與各國簽證代辦規費、司機領隊與導遊小費、行程外之個人消費、行李超重費及個人旅遊平安險。</p><p>2. 組團成行與異動通知<br/>國外團體行程：如未達最低成行人數，本公司將於出發前 7 天通知旅客，協助轉團或全額退還已繳費用。<br/>國外客製包團：依雙方確認之專屬企劃書條款與約定時間執行。</p><p>3. 不可抗力因素與安全處置<br/>逢天災、戰亂、傳染病、各國邊境管制或航班異動等不可抗力事件導致行程變更或無法出發時，本公司將扣除已代付且無法退還之規費與必要費用後，將餘款退還旅客。</p><p>4. 投保保險資訊<br/>本公司已依法投保「旅行業履約保證保險」及「旅行業責任保險」（包含意外事故醫療及身故保障）。</p>",
  },
  {
    id: "clause-3",
    title: "契約簽署方式",
    content:
      "<p>證件繳交：請於出發前指定天數內，提供有效期限內之護照影本及相關簽證所需文件（如需代辦護照/簽證服務，亦可一併為您處理）。</p><p>結清尾款：於出發前 7～14 天（依各團型規範為準）付清旅遊行程之剩餘尾款。</p>",
  },
];
