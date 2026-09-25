"use client";

import AdminInfoNote from "../ui/AdminInfoNote";
import AdminTextInput from "../ui/AdminTextInput";
import type { CopyrightInfo } from "./data";

export default function CopyrightSection({
  info,
  onChange,
}: {
  info: CopyrightInfo;
  onChange: (patch: Partial<CopyrightInfo>) => void;
}) {
  const updateLink = (id: string, patch: Partial<CopyrightInfo["links"][number]>) => {
    onChange({ links: info.links.map((link) => (link.id === id ? { ...link, ...patch } : link)) });
  };

  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">版權與頁尾連結</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">
          設定頁尾底部的版權宣告文字，以及「匯款資訊」「旅客須知及服務條款」等頁尾功能連結。
        </p>
      </div>

      <AdminTextInput
        label="版權文字（Copyright）"
        value={info.copyrightText}
        onChange={(v) => onChange({ copyrightText: v })}
      />

      {info.links.map((link) => (
        <div key={link.id} className="grid grid-cols-2 gap-4">
          <AdminTextInput label="連結名稱" value={link.label} onChange={(v) => updateLink(link.id, { label: v })} />
          <AdminTextInput label="連結網址" value={link.url} onChange={(v) => updateLink(link.id, { url: v })} />
        </div>
      ))}

      <AdminInfoNote>
        此區塊套用至網站所有頁面的頁尾，修改後將同步更新每一頁；「旅客須知及服務條款」連結可對應「關於我們」下的訂購流程、旅遊契約書等頁面。
      </AdminInfoNote>
    </section>
  );
}
