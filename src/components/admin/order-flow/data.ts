export type OrderFlowStep = {
  id: string;
  label: string;
  visible: boolean;
  title: string;
  content: string;
};

export type BankInfo = {
  visible: boolean;
  accountName: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  note: string;
};

export type ReminderInfo = {
  content: string;
};

export const INITIAL_STEPS: OrderFlowStep[] = [
  {
    id: "step-1",
    label: "步驟 1",
    visible: true,
    title: "Step 1. 挑選行程或提出需求",
    content:
      "<p>一般國外團體：於網站瀏覽精選行程，選擇您心儀的旅遊目的地、出發日期與團型。</p><p>客製包團：填寫「客製包團需求單」，或直接透過官方 Line／電話聯繫專員，告知您的預計天數、地點、人數與預算等初步構想。</p>",
  },
  {
    id: "step-2",
    label: "步驟 2",
    visible: true,
    title: "Step 2. 確認行程內容與報價",
    content: "",
  },
  {
    id: "step-3",
    label: "步驟 3",
    visible: true,
    title: "Step 3. 填寫報名資料",
    content: "",
  },
  {
    id: "step-4",
    label: "步驟 4",
    visible: true,
    title: "Step 4. 繳交訂金並完成付款",
    content: "",
  },
  {
    id: "step-5",
    label: "步驟 5",
    visible: true,
    title: "Step 5. 收到出團確認通知",
    content: "",
  },
];

export const INITIAL_BANK_INFO: BankInfo = {
  visible: true,
  accountName: "嘉新旅遊股份有限公司",
  bankName: "中國信託商業銀行",
  bankCode: "822",
  accountNumber: "1234-5678-9012-3456",
  note: "<p>請於完成匯款後，透過官方 Line 或電話告知後五碼，並務必於備註欄填寫「訂單編號」，以利對帳與確認出團資格。</p>",
};

export const INITIAL_REMINDER: ReminderInfo = {
  content:
    "<p>訂購成功後，我們將以 Email 及簡訊發送行前通知，請務必確認聯絡資訊正確無誤。若有任何問題，歡迎撥打客服專線洽詢；另請留意取消與退訂規定，出發前 7 日內取消將酌收手續費。</p>",
};
