"use client";

import AdminInfoNote from "../ui/AdminInfoNote";
import AdminTextInput from "../ui/AdminTextInput";
import RichTextEditor from "../trips/RichTextEditor";
import type { PolicyIntro } from "./data";

export default function PolicyIntroSection({
  tabLabel,
  intro,
  onChange,
}: {
  /** The 旅客須知 tab this page maps to, e.g. 「取消／退訂規定」. */
  tabLabel: string;
  intro: PolicyIntro;
  onChange: (patch: Partial<PolicyIntro>) => void;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">頁面標題與說明</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">
          設定此頁面最上方的標題與導言文字，對應前台「{tabLabel}」頁籤最上方內容。
        </p>
      </div>

      <AdminTextInput label="頁面標題" value={intro.pageTitle} onChange={(v) => onChange({ pageTitle: v })} />

      <div className="flex flex-col gap-[7px]">
        <span className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">頁面說明</span>
        <RichTextEditor value={intro.description} onChange={(html) => onChange({ description: html })} />
        <p className="text-xs leading-[1.45em] text-[#535F71]">可貼上多段文字；編輯器會保留基本段落與列表格式。</p>
      </div>

      <AdminInfoNote>此區塊對應「{tabLabel}」頁籤最上方的標題與導言文字。</AdminInfoNote>
    </section>
  );
}
