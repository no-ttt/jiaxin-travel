"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFooter } from "@/lib/api/hooks/useCms";

/**
 * 個人資料蒐集與使用說明（個資法第 8 條告知事項）。
 * TODO: placeholder wording drafted by the dev team — replace with the text the client provides.
 */
const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "一、蒐集機關",
    body: ["嘉新旅遊股份有限公司（以下簡稱「本公司」）。"],
  },
  {
    title: "二、蒐集目的",
    body: [
      "為提供行程洽詢、客製包團規劃、報價及後續旅遊服務聯繫，本公司依個人資料保護法蒐集您的個人資料，蒐集目的包括：〇六九 契約、類似契約或其他法律關係事務；〇九〇 消費者、客戶管理與服務；一五七 調查、統計與研究分析。",
    ],
  },
  {
    title: "三、個人資料類別",
    body: ["C001 辨識個人者：姓名、聯絡電話、電子郵件、LINE ID、公司或團體名稱，以及您於表單中填寫的需求說明。"],
  },
  {
    title: "四、利用期間、地區、對象及方式",
    body: [
      "期間：自您提交表單起，至蒐集目的消失或依法令規定應保存之期限為止。",
      "地區：中華民國境內，以及因行程安排需要之旅遊目的地國家或地區。",
      "對象：本公司及因提供旅遊服務需要之合作廠商（如航空公司、飯店、當地旅行社），僅於必要範圍內提供。",
      "方式：以電話、電子郵件、LINE 或書面等方式，於前述目的範圍內聯繫與利用。",
    ],
  },
  {
    title: "五、您的權利",
    body: [
      "依個人資料保護法第 3 條，您可向本公司請求查詢、閱覽、製給複製本、補充或更正、停止蒐集處理利用或刪除您的個人資料。",
    ],
  },
  {
    title: "六、不提供個人資料的影響",
    body: ["您可自由選擇是否提供個人資料；若未提供必要欄位，本公司將無法與您聯繫或提供相關服務。"],
  },
];

/** Closing by Esc or the backdrop dismisses without consent; only 「我知道了」 acknowledges. */
function PrivacyNoticeContent({ onAcknowledge, onClose }: { onAcknowledge: () => void; onClose: () => void }) {
  const { data: footer } = useFooter();
  const contacts = [footer?.phone && `電話 ${footer.phone}`, footer?.email && `Email ${footer.email}`].filter(Boolean);
  // 「我知道了」 unlocks once the notice has been scrolled to the end (or fits without scrolling).
  const bodyRef = useRef<HTMLDivElement>(null);
  const [readToEnd, setReadToEnd] = useState(false);
  const checkReadToEnd = useCallback(() => {
    const el = bodyRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 4) setReadToEnd(true);
  }, []);

  useEffect(() => {
    checkReadToEnd();
    window.addEventListener("resize", checkReadToEnd);
    return () => window.removeEventListener("resize", checkReadToEnd);
  }, [checkReadToEnd]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(5,20,41,0.45)] px-4 py-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-notice-title"
        className="flex max-h-full w-full max-w-[640px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0px_18px_46px_0px_rgba(20,41,71,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[#E0E3E8] px-6 py-4 sm:px-8">
          <h2 id="privacy-notice-title" className="text-lg font-bold text-[#090909]">
            個人資料蒐集與使用說明
          </h2>
        </div>

        <div
          ref={bodyRef}
          onScroll={checkReadToEnd}
          className="flex flex-col gap-5 overflow-y-auto px-6 py-5 text-sm leading-[1.7] text-[#535F71] sm:px-8"
        >
          {SECTIONS.map((section) => (
            <section key={section.title} className="flex flex-col gap-1.5">
              <h3 className="font-bold text-[#090909]">{section.title}</h3>
              {section.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </section>
          ))}
          {contacts.length > 0 && <p>如需行使上述權利，請與本公司聯繫：{contacts.join("／")}。</p>}
        </div>

        <div className="border-t border-[#E0E3E8] px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={onAcknowledge}
            disabled={!readToEnd}
            className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] text-sm font-bold text-white hover:bg-[#0047c2] disabled:cursor-not-allowed disabled:bg-[#B4BED1] disabled:hover:bg-[#B4BED1]"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}

type PrivacyConsentCheckboxProps = { checked: boolean; onChange: (checked: boolean) => void };

/**
 * 「我已閱讀並同意個人資料蒐集與使用說明」: the box can only be ticked through the notice's 「我知道了」
 * (ticking it directly opens the notice instead); unticking is always allowed.
 * The dialog is portaled out of the <label>, so clicks inside it don't reach the checkbox.
 */
export default function PrivacyConsentCheckbox({ checked, onChange }: PrivacyConsentCheckboxProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const acknowledge = useCallback(() => {
    setOpen(false);
    onChange(true);
  }, [onChange]);

  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => (event.target.checked ? setOpen(true) : onChange(false))}
        className="peer sr-only"
      />
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border border-[#C7CFD9] text-white peer-checked:border-[#0053E0] peer-checked:bg-[#0053E0]">
        {checked && (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M2.5 6.5L5 9L10.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[15px] leading-[1.45] text-[#535F71]">
        我已閱讀並同意
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
          className="cursor-pointer text-[#0053E0] underline underline-offset-2 hover:text-[#0047c2]"
        >
          個人資料蒐集與使用說明
        </button>
      </span>
      {open && createPortal(<PrivacyNoticeContent onAcknowledge={acknowledge} onClose={close} />, document.body)}
    </label>
  );
}
