"use client";

import AdminImageDropzone from "../ui/AdminImageDropzone";
import AdminTextInput from "../ui/AdminTextInput";
import AdminTextarea from "../ui/AdminTextarea";
import type { BrandInfo } from "./data";

export default function BrandInfoSection({
  info,
  onChange,
}: {
  info: BrandInfo;
  onChange: (patch: Partial<BrandInfo>) => void;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">品牌與公司資訊</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">
          設定頁尾顯示的品牌 Logo、中英文名稱與旅行社法定登記資訊。
        </p>
      </div>

      <AdminImageDropzone label="上傳圖示" hint="Logo（建議透明背景 PNG）" size="sm" hintPosition="beside" />

      <div className="grid grid-cols-2 gap-4">
        <AdminTextInput label="品牌名稱（中文）" value={info.nameZh} onChange={(v) => onChange({ nameZh: v })} />
        <AdminTextInput label="品牌名稱（英文）" value={info.nameEn} onChange={(v) => onChange({ nameEn: v })} />
      </div>

      <AdminTextarea
        label="公司法定資訊（旅行社名稱／代表人／統編／證號，最多三行）"
        value={info.legalInfo}
        rows={3}
        onChange={(v) => onChange({ legalInfo: v })}
      />
    </section>
  );
}
