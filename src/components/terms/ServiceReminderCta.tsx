"use client";

import Image from "next/image";
import Link from "next/link";
import { useFooter } from "@/lib/api/hooks/useCms";

/** The phone number is the one set in 網站頁尾設定 (same as the footer). */
export default function ServiceReminderCta() {
  const { data: footer } = useFooter();
  const phone = footer?.phone;
  return (
    <div
      className="flex w-full flex-1 flex-col items-start justify-between gap-6 rounded-[20px] px-6 py-5 sm:flex-row sm:items-center sm:px-8"
      style={{
        background: "linear-gradient(90deg, rgba(232, 242, 255, 1) 0%, rgba(250, 245, 232, 1) 100%)",
      }}
    >
      <div className="flex items-center gap-4">
        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] bg-white">
          <Image src="/images/phone-call.svg" alt="" width={24} height={24} />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-xl font-bold text-[#090909]">需要進一步協助？</h3>
          <p className="text-sm leading-[1.6] text-[#535F71]">
            如需現場諮詢，建議提前電話預約，由專人為您安排服務時間。
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-4 sm:w-auto">
        {phone && (
          <a href={`tel:${phone}`} className="text-[15px] font-semibold tracking-wide text-[#002366]">
            {phone}
          </a>
        )}
        <Link
          href="/contact"
          className="flex h-11 w-[118px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0053E0] text-sm font-bold text-white hover:bg-[#0047c2]"
        >
          聯絡我們
        </Link>
      </div>
    </div>
  );
}
