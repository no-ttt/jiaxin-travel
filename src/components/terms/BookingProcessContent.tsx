import type { PurchaseFlowPage } from "@/lib/api/types/cms";
import { isBlankHtml } from "@/lib/html";
import { BODY_HTML_CLASS } from "./contentHtml";
import CopyAccountButton from "./CopyAccountButton";

export default function BookingProcessContent({ page }: { page: PurchaseFlowPage }) {
  // The public API already drops hidden steps; empty ones are skipped too (as the admin note says).
  const steps = page.steps.filter((step) => step.visible !== false && !isBlankHtml(step.body_html));
  const { payment } = page;

  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <h2 className="font-serif text-[28px] font-bold text-[#090909] sm:text-4xl">訂購流程</h2>
        <p className="text-sm leading-[1.65] text-[#535F71] sm:text-base">
          在預訂與出發前，請先了解以下重要事項。清楚的資訊能保障您的權益，也讓整趟旅程更安心。
        </p>
      </div>

      <div className="flex w-full flex-col gap-9 rounded-[22px] border border-[#E0E3E8] bg-white px-6 py-11 shadow-[0px_10px_28px_0px_rgba(5,20,41,0.05)] sm:px-12">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col gap-3.5">
            {index > 0 && <div className="-mt-3.5 mb-3.5 h-px w-full bg-[#E0E3E8]" />}
            <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">{step.title}</h3>
            <div className={BODY_HTML_CLASS} dangerouslySetInnerHTML={{ __html: step.body_html }} />
          </div>
        ))}

        {payment.visible && (
          // Anchor for the footer's 匯款資訊 link (/terms#payment-info); scroll-mt clears the sticky header.
          <div
            id="payment-info"
            className="flex scroll-mt-28 flex-col gap-4 rounded-[20px] bg-[#EDF5FF]/60 px-5 py-5 sm:px-6"
          >
            <h3 className="text-2xl font-medium text-[#090909]">匯款資訊</h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-sm text-[#535F71]">戶名：</span>
                <span className="text-[15px] text-[#090909]">{payment.account_name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-sm text-[#535F71]">銀行：</span>
                <span className="text-[15px] text-[#090909]">{payment.bank_name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-sm text-[#535F71]">代碼：</span>
                <span className="text-xl font-bold text-[#0053E0]">{payment.bank_code}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-14 shrink-0 text-sm text-[#535F71]">帳號：</span>
                <span className="text-xl font-bold text-[#0053E0]">{payment.account_number}</span>
                <CopyAccountButton accountNumber={payment.account_number} />
              </div>
            </div>
            {!isBlankHtml(payment.note_html) && (
              <div
                className="flex flex-col gap-1 text-[13px] leading-[1.65] text-[#535F71] [&_a]:text-[#0053E0] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: payment.note_html }}
              />
            )}
          </div>
        )}

        {!isBlankHtml(page.reminder_html) && (
          <div className="flex flex-col gap-3 rounded-[20px] bg-[#FFF7E3] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEBB2] text-[22px]">
                💡
              </span>
              <h3 className="text-2xl font-medium text-[#090909]">溫馨提醒</h3>
            </div>
            <div className={BODY_HTML_CLASS} dangerouslySetInnerHTML={{ __html: page.reminder_html }} />
          </div>
        )}
      </div>
    </div>
  );
}
