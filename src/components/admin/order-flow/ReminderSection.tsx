"use client";

import AdminInfoNote from "../ui/AdminInfoNote";
import RichTextEditor from "../trips/RichTextEditor";
import type { ReminderInfo } from "./data";

export default function ReminderSection({
  info,
  onChange,
}: {
  info: ReminderInfo;
  onChange: (patch: Partial<ReminderInfo>) => void;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">溫馨提醒</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">
          設定提醒圖示與內容，前台將以警示卡片樣式（淺黃底＋左側亮色邊條）顯示，關鍵字可於下方編輯器中加粗或套用主題色強調。
        </p>
      </div>

      <div className="flex flex-col gap-[7px]">
        <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">提醒內容</span>
        <RichTextEditor
          value={info.content}
          onChange={(html) => onChange({ content: html })}
          placeholder="輸入前台「溫馨提醒」要展示的內容。可使用段落、清單與連結。"
        />
        <p className="text-xs leading-[1.45em] text-[#535F71]">
          可將「客服專線」「取消與退訂規定」等關鍵字加粗或套用主色，前台將依編輯器格式呈現。
        </p>
      </div>

      <AdminInfoNote>
        此區塊將以淺黃卡片、左側亮色邊條顯示於「訂購流程」頁面最下方；圖示將放大並置於專屬背景圓圈中，內文關鍵字依上方編輯器的粗體／顏色設定呈現。
      </AdminInfoNote>
    </section>
  );
}
