"use client";

import AdminInfoNote from "../ui/AdminInfoNote";
import AdminTextInput from "../ui/AdminTextInput";
import type { ContractDocument } from "./data";

export default function DocumentSection({
  document,
  onChange,
}: {
  document: ContractDocument;
  onChange: (patch: Partial<ContractDocument>) => void;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">契約書文件</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">
          設定契約書文件名稱與下載連結，對應前台「旅遊契約書」頁籤第一個段落。
        </p>
      </div>

      <AdminTextInput
        label="文件標題"
        value={document.documentTitle}
        onChange={(v) => onChange({ documentTitle: v })}
      />
      <AdminTextInput label="連結顯示文字" value={document.linkText} onChange={(v) => onChange({ linkText: v })} />
      <AdminTextInput
        label="下載連結網址／檔案"
        value={document.fileUrl}
        onChange={(v) => onChange({ fileUrl: v })}
      />

      <AdminInfoNote>此區塊對應「旅遊契約書」頁籤的文件標題與下載連結（藍色底線樣式顯示）。</AdminInfoNote>
    </section>
  );
}
