"use client";

import AdminInfoNote from "../ui/AdminInfoNote";
import AdminTextInput from "../ui/AdminTextInput";
import ToggleSwitch from "../ui/ToggleSwitch";
import RichTextEditor from "../trips/RichTextEditor";
import type { BankInfo } from "./data";

export default function BankInfoSection({
  info,
  onChange,
}: {
  info: BankInfo;
  onChange: (patch: Partial<BankInfo>) => void;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">匯款資訊</h2>
          <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">
            設定官方匯款帳戶資訊，前台將以卡片與粗體強調樣式顯示於「訂購流程」頁面末端，並提供一鍵複製帳號功能。
          </p>
        </div>
        <ToggleSwitch
          checked={info.visible}
          onChange={() => onChange({ visible: !info.visible })}
          label="切換匯款資訊顯示於前台"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AdminTextInput label="戶名" value={info.accountName} onChange={(v) => onChange({ accountName: v })} />
        <AdminTextInput label="銀行" value={info.bankName} onChange={(v) => onChange({ bankName: v })} />
        <AdminTextInput
          label="代碼（前台將放大粗體顯示）"
          value={info.bankCode}
          onChange={(v) => onChange({ bankCode: v })}
        />
        <AdminTextInput
          label="帳號（前台將放大粗體並提供複製按鈕）"
          value={info.accountNumber}
          onChange={(v) => onChange({ accountNumber: v })}
        />
      </div>

      <div className="flex flex-col gap-[7px]">
        <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">備註說明（顯示於帳戶資訊下方）</span>
        <RichTextEditor
          value={info.note}
          onChange={(html) => onChange({ note: html })}
          placeholder="輸入匯款備註說明。可使用段落、清單與連結。"
        />
        <p className="text-xs leading-[1.45em] text-[#535F71]">
          可貼上多段文字；編輯器會保留基本段落與列表格式。
        </p>
      </div>

      <AdminInfoNote>
        此區塊將以淺藍卡片、左側主色邊條顯示於「訂購流程」頁面 Step 5 之後；帳號旁備有「複製帳號」按鈕，代碼與帳號將放大加粗。
      </AdminInfoNote>
    </section>
  );
}
