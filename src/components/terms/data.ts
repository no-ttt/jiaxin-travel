export type TermsTabId =
  | "booking-process"
  | "cancellation-policy"
  | "travel-contract"
  | "fraud-alert"
  | "announcements";

export type TermsTab = {
  id: TermsTabId;
  label: string;
};

export const TERMS_TABS: TermsTab[] = [
  { id: "booking-process", label: "訂購流程" },
  { id: "cancellation-policy", label: "取消／退訂規定" },
  { id: "travel-contract", label: "旅遊契約書" },
  { id: "fraud-alert", label: "防詐騙提醒說明" },
  { id: "announcements", label: "聲明公告專區" },
];

export type PolicySection = {
  title: string;
  body: string[];
};

export const BOOKING_PROCESS_SECTIONS: PolicySection[] = [
  {
    title: "Step 1. 挑選行程或提出需求",
    body: [
      "一般國外團體：於網站瀏覽精選行程，選擇您心儀的旅遊目的地、出發日期與團型。",
      "客製包團：填寫「客製包團需求單」，或直接透過官方 Line／電話聯繫專員，告知您的預計天數、地點、人數與預算等初步構想。",
    ],
  },
  {
    title: "Step 2. 專人諮詢與行程確認",
    body: [
      "一般國外團體：旅遊顧問將主動與您聯繫，確認可報名名額、航班時間及參團相關注意事項。",
      "客製包團：專屬顧問將根據您的需求規劃專屬企劃書與初步報價，並與您彈性討論與調整行程細節，直到完全滿意。",
    ],
  },
  {
    title: "Step 3. 簽署旅遊契約與支付訂金",
    body: [
      "行程內容確認無誤後，顧問將為您提供「定型化旅遊契約書」進行簽署，保障您的合法權益。",
      "請於指定期限內完成訂金支付（支援信用卡轉帳、銀行匯款等多種付款方式），收到訂金後即為您正式保留機位、飯店與各項行程元件。",
    ],
  },
  {
    title: "Step 4. 行前資料繳交與付清尾款",
    body: [
      "證件繳交：請於出發前指定天數內，提供有效期限內之護照影本及相關簽證所需文件（如需代辦護照／簽證服務，亦可一併為您處理）。",
      "結清尾款：於出發前 7～14 天（依各團型規範為準）付清旅遊行程之剩餘尾款。",
    ],
  },
  {
    title: "Step 5. 說明會資料領取與愉快出發",
    body: [
      "行前說明會資料（包含集合時間地點、電子機票、飯店清單、領隊資訊及當地注意事項）將於出發前 3～7 天提供給您。",
      "帶著期待的心情，準時前往指定地點集合，展開您的精彩旅程！",
    ],
  },
];

export const REMITTANCE_INFO = {
  accountName: "嘉新旅遊股份有限公司",
  bank: "OO銀行 三民分行",
  bankCode: "000",
  accountNumber: "0000-0000-0000-000",
  note: "完成匯款後，請主動聯繫您的專屬顧問告知匯款末五碼與訂單編號，以利核對訂金／尾款。\n請務必匯款至上述官方帳戶，如接獲其他帳戶要求匯款，請提高警覺並致電客服確認，以防詐騙。",
};

export type TipItem = {
  before: string;
  highlight: string;
  after: string;
};

export const BOOKING_PROCESS_TIP: { title: string; items: TipItem[] } = {
  title: "溫馨提醒",
  items: [
    {
      before: "若您對於訂購流程有任何疑問，歡迎隨時聯繫您的專屬旅遊顧問或撥打",
      highlight: "客服專線",
      after: "。",
    },
    {
      before: "如需了解取消、退款相關規定，請參閱本站之「",
      highlight: "取消與退訂規定",
      after: "」。",
    },
  ],
};

export const TRAVEL_CONTRACT_HEADING = {
  title: "旅遊契約與權益說明",
  description:
    "為保障您的出國旅遊權益，本公司所有國外團體行程與國外專屬客製包團服務，皆嚴格遵守交通部觀光署頒布之《國外旅遊定型化契約範本》。",
};

export type ContractLinkSection = {
  title: string;
  linkLabel: string;
  href: string;
};

export const TRAVEL_CONTRACT_DOWNLOAD: ContractLinkSection = {
  title: "國外旅遊定型化契約書（觀光署標準範本）",
  linkLabel: "國外旅遊定型化契約書下載",
  href: "#",
};

export const TRAVEL_CONTRACT_FORMATION: PolicySection = {
  title: "契約成立與生效條件",
  body: [
    "由於本公司行程（含客製包團與精選國外團體）需由專人為您確認機位、飯店名額或專屬行程規劃，送出預約或諮詢需求時契約尚未生效。",
    "當專屬旅遊顧問為您確認行程／名額無誤，且您完成訂金支付後，旅遊契約即正式成立生效。",
  ],
};

export const TRAVEL_CONTRACT_SIGNING: PolicySection = {
  title: "契約簽署方式",
  body: [
    "證件繳交：請於出發前指定天數內，提供有效期限內之護照影本及相關簽證所需文件（如需代辦護照／簽證服務，亦可一併為您處理）。",
    "結清尾款：於出發前 7～14 天（依各團型規範為準）付清旅遊行程之剩餘尾款。",
  ],
};

export type ContractSummaryGroup = {
  heading: string;
  items: string[];
  paragraph?: string;
};

export const TRAVEL_CONTRACT_SUMMARY: {
  title: string;
  groups: ContractSummaryGroup[];
} = {
  title: "重要條款摘要",
  groups: [
    {
      heading: "1. 費用涵蓋與自費項目",
      items: [
        "團費包含：國際機票、行程表中標示之住宿與餐食、景點門票、團體陸上交通、旅行業責任保險。",
        "團費不含：護照與各國簽證代辦規費、司機領隊與導遊小費、行程外之個人消費、行李超重費及個人旅遊平安險。",
      ],
    },
    {
      heading: "2. 組團成行與異動通知",
      items: [
        "國外團體行程：如未達最低成行人數，本公司將於出發前 7 天通知旅客，協助轉團或全額退還已繳費用。",
        "國外客製包團：依雙方確認之專屬企劃書條款與約定時間執行。",
      ],
    },
    {
      heading: "3. 不可抗力因素與安全處置",
      items: [],
      paragraph:
        "逢天災、戰亂、傳染病、各國邊境管制或航班異動等不可抗力事件導致行程變更或無法出發時，本公司將扣除已代付且無法退還之規費與必要費用後，將餘款退還旅客。",
    },
    {
      heading: "4. 投保保險資訊",
      items: [],
      paragraph:
        "本公司已依法投保「旅行業履約保證保險」及「旅行業責任保險」（包含意外事故醫療及身故保障）。",
    },
  ],
};

export const FRAUD_ALERT_HEADING = {
  title: "防詐騙提醒與注意事項",
  description:
    "近期詐騙事件頻傳，不法人士常假冒旅行社名義或以優惠名目進行詐騙。為保障您的旅遊權益，嘉新旅遊整理最常見的詐騙方式與正確查證方法，請務必留意並協助提醒身邊親友。",
};

export type FraudAlertGroup = {
  heading: string;
  items: string[];
  paragraph?: string;
};

export const FRAUD_ALERT_SECTIONS: {
  title: string;
  groups?: FraudAlertGroup[];
  paragraph?: string;
}[] = [
  {
    title: "一、最常見的詐騙方式",
    groups: [
      {
        heading: "1. 冒名旅行社要求提供個資",
        items: [],
        paragraph:
          "詐騙者可能假冒「嘉新旅遊客服／業務」主動聯繫，要求您提供身分證資料、護照、信用卡資訊、銀行帳號等。",
      },
      {
        heading: "2. 假客服要求匯款／重新付款",
        items: [],
        paragraph:
          "不肖人士會以「訂單出錯」「需補款」「系統異常」為由，要求您立即付款、操作 ATM 或點擊付款連結。我們不會要求您操作 ATM，也不會用不明連結收款；本公司唯一匯款帳戶為「嘉新旅遊股份有限公司」，第一銀行 桃園分行（代號 007），帳號：012-345-6789-0，付款前請務必核對戶名與帳號。",
      },
      {
        heading: "3. 假交友、假顧問誘導加入「投資群組」詐騙",
        items: [],
        paragraph:
          "近期詐騙集團常假冒旅遊顧問、業者或朋友，透過交友邀請建立信任後，聲稱「旅行社有內部投資群組」「加入 LINE 群組可以賺旅費」，進而要求加入投資群組、下載陌生投資 App、提供證件照片，投入金額後即無法出金。嘉新旅遊不會經營、推薦或合作任何投資平台或投資群組，也不會要求旅客加入與旅遊無關的 LINE 群組；凡涉及「投資、股票、虛擬幣、穩賺不賠」皆為高風險詐騙。",
      },
      {
        heading: "4. 假冒粉專、假網站、假 LINE 帳號",
        items: [],
        paragraph:
          "詐騙者可能使用相似名稱、Logo、圖片建立假專頁，並推出低價促銷吸引付款。請認明官方網站：www.chiahsintravel.com.tw，購買旅遊商品請直接透過官網或專屬服務人員辦理，並確認洽談對象是否為本公司正式員工。",
      },
      {
        heading: "5. 假包裹通知／貨到付款詐騙",
        items: [],
        paragraph: "以「包裹待取」「需補運費」為由要求付費或點擊連結。本公司不會寄送需貨到付款的包裹。",
      },
    ],
  },
  {
    title: "二、如何確認是否為官方訊息",
    groups: [
      {
        heading: "① 透過官方聯絡方式確認",
        items: [],
        paragraph: "所有行程、付款與通知，都會透過本公司官網、電話或官方 LINE@ 確認。",
      },
      {
        heading: "② 嚴重警示語與催促付款即為高風險",
        items: [],
        paragraph: "例如限時付款、否則訂單取消、ATM 解除分期等，皆為詐騙慣用語。",
      },
      {
        heading: "③ 不明連結一律不要點",
        items: [],
        paragraph: "收到非官方來源的簡訊或訊息，請先向專屬業務或致電公司確認再操作。",
      },
    ],
    paragraph: "請記住三個原則：",
  },
  {
    title: "三、遇到可疑情況怎麼做",
    groups: [
      {
        heading: "第一步",
        items: [],
        paragraph: "立即向我們求證，請撥打官方電話 03-3373577 查證。",
      },
      {
        heading: "第二步",
        items: [],
        paragraph: "直接撥打 165 反詐騙專線，警方會協助判斷訊息真假並提供後續建議。",
      },
      {
        heading: "第三步",
        items: [],
        paragraph:
          "若已提供資料或轉帳，請儘速通知銀行或信用卡公司凍結交易、保存所有對話紀錄，並前往警局報案。",
      },
    ],
  },
];

export const FRAUD_ALERT_SUMMARY = {
  title: "四、重要提醒總結",
  paragraph:
    "我們不會要求操作 ATM 或點擊陌生連結；有疑問請務必先向我們或 165 查證。當感覺怪怪的，就是該停下來查證的時候——旅行應該是期待，而不是擔憂，讓我們一起提高警覺，守護每一次的旅遊體驗。",
};
