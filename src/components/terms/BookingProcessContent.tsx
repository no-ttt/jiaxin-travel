import Link from "next/link";
import {
  BOOKING_PROCESS_SECTIONS,
  BOOKING_PROCESS_TIP,
  REMITTANCE_INFO,
} from "./data";

export default function BookingProcessContent() {
  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <h2 className="font-serif text-[28px] font-bold text-[#090909] sm:text-4xl">訂購流程</h2>
        <p className="text-sm leading-[1.65] text-[#535F71] sm:text-base">
          在預訂與出發前，請先了解以下重要事項。清楚的資訊能保障您的權益，也讓整趟旅程更安心。
        </p>
      </div>

      <div className="flex w-full flex-col gap-9 rounded-[22px] border border-[#E0E3E8] bg-white px-6 py-11 shadow-[0px_10px_28px_0px_rgba(5,20,41,0.05)] sm:px-12">
        {BOOKING_PROCESS_SECTIONS.map((section, index) => (
          <div key={section.title} className="flex flex-col gap-3.5">
            {index > 0 && <div className="-mt-3.5 mb-3.5 h-px w-full bg-[#E0E3E8]" />}
            <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">{section.title}</h3>
            <div className="flex flex-col gap-1.5 text-[15px] leading-[1.85] text-[#535F71]">
              {section.body.map((line) => (
                <p key={line}>・{line}</p>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-4 rounded-[20px] bg-[#EDF5FF]/60 px-5 py-5 sm:px-6">
          <h3 className="text-2xl font-medium text-[#090909]">匯款資訊</h3>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-sm text-[#535F71]">戶名：</span>
              <span className="text-[15px] text-[#090909]">{REMITTANCE_INFO.accountName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-sm text-[#535F71]">銀行：</span>
              <span className="text-[15px] text-[#090909]">{REMITTANCE_INFO.bank}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-sm text-[#535F71]">代碼：</span>
              <span className="text-xl font-bold text-[#0053E0]">{REMITTANCE_INFO.bankCode}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-14 shrink-0 text-sm text-[#535F71]">帳號：</span>
              <span className="text-xl font-bold text-[#0053E0]">{REMITTANCE_INFO.accountNumber}</span>
              <Link
                href="/search"
                className="flex h-9 cursor-pointer items-center justify-center rounded-xl border border-[#0053E0] px-3.5 text-[13px] font-medium text-[#0053E0] hover:bg-[#F5F8FF]"
              >
                查看行程
              </Link>
            </div>
          </div>
          <p className="whitespace-pre-line text-[13px] leading-[1.65] text-[#535F71]">
            {REMITTANCE_INFO.note}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] bg-[#FFF7E3] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEBB2] text-[22px]">
              💡
            </span>
            <h3 className="text-2xl font-medium text-[#090909]">{BOOKING_PROCESS_TIP.title}</h3>
          </div>
          <div className="flex flex-col gap-1.5 text-[15px] leading-[1.85] text-[#535F71]">
            {BOOKING_PROCESS_TIP.items.map((item) => (
              <p key={item.highlight}>
                ・{item.before}
                <span className="font-bold text-[#9E5905]">{item.highlight}</span>
                {item.after}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
