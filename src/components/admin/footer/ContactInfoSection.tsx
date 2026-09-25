"use client";

import AdminTextInput from "../ui/AdminTextInput";
import type { ContactInfo } from "./data";

export default function ContactInfoSection({
  info,
  onChange,
}: {
  info: ContactInfo;
  onChange: (patch: Partial<ContactInfo>) => void;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">聯絡資訊與社群連結</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">
          設定頁尾顯示的聯絡電話、地址、Email，以及 LINE／Facebook／Instagram 社群連結網址。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AdminTextInput label="聯絡電話" value={info.phone} onChange={(v) => onChange({ phone: v })} />
        <AdminTextInput label="聯絡 Email" value={info.email} onChange={(v) => onChange({ email: v })} />
      </div>

      <AdminTextInput label="公司地址" value={info.address} onChange={(v) => onChange({ address: v })} />

      <div className="grid grid-cols-2 gap-4">
        <AdminTextInput
          label="LINE 官方帳號連結"
          value={info.lineUrl}
          onChange={(v) => onChange({ lineUrl: v })}
        />
        <AdminTextInput
          label="Facebook 粉絲專頁連結"
          value={info.facebookUrl}
          onChange={(v) => onChange({ facebookUrl: v })}
        />
      </div>

      <AdminTextInput
        label="Instagram 連結"
        value={info.instagramUrl}
        onChange={(v) => onChange({ instagramUrl: v })}
      />
    </section>
  );
}
