"use client";

import { useState } from "react";
import type { TripDetail } from "./types";

const TABS = ["行前必讀", "護照簽證", "旅遊指南", "出入境須知"] as const;
type Tab = (typeof TABS)[number];

const PLACEHOLDER_CONTENT: Record<Exclude<Tab, "行前必讀">, string> = {
  護照簽證: "護照效期須在回國當日起算6個月以上，如需辦理簽證，將由專員協助說明所需文件與流程。",
  旅遊指南: "當地電壓、時差、氣候與穿著建議等旅遊資訊，將於行前說明會提供完整資料。",
  出入境須知: "海關申報、行李限重與免稅規定，請參考各國海關最新公告，專員亦會於出發前提醒。",
};

export default function BookingNotice({ trip }: { trip: TripDetail }) {
  const [activeTab, setActiveTab] = useState<Tab>("行前必讀");

  return (
    <section id="notice" className="scroll-mt-28 pt-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-6">
        <h2 className="whitespace-nowrap font-serif text-2xl font-bold text-[#090909]">訂購須知</h2>
        <div className="flex flex-wrap items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex h-10 cursor-pointer items-center justify-center rounded-[9px] px-3 text-sm transition ${
                activeTab === tab
                  ? "bg-[#ECF1FA] font-bold text-[#0053E0]"
                  : "font-medium text-[#535F71] hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[22px] pb-[30px] pt-[22px]">
        <div className="rounded-[10px] border border-[#E0E3E8] bg-[#ECF1FA] px-3.5 py-2.5">
          <p className="text-[13px] leading-relaxed text-[#333]">
            ★ 為確保您有一趟美好的旅行，報名前請務必詳閱以下內容
          </p>
        </div>

        {activeTab === "行前必讀" ? (
          <div className="flex flex-col gap-[30px] rounded-2xl border border-[#E0E3E8] bg-white px-5 py-[22px] shadow-[0px_7px_20px_0px_rgba(5,20,41,0.04)]">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 border-b border-[#E0E3E8] pb-2.5">
                <span className="h-2 w-2 rounded-sm bg-[#0053E0]" />
                <h3 className="text-base text-[#333]">小費說明</h3>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#333]">{trip.tipNotice}</p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-[#333]">行程提醒：</h4>
              <ol className="flex flex-col gap-2">
                {trip.reminders.map((reminder, i) => (
                  <li key={i} className="flex gap-1 text-sm text-[#333]">
                    <span>{i + 1}.</span>
                    <span>{reminder}</span>
                  </li>
                ))}
                <li className="flex gap-1 text-sm text-[#333]">
                  <span>{trip.reminders.length + 1}.</span>
                  <ul className="flex flex-col gap-2 pl-1">
                    {trip.ageReminderItems.map((item, i) => {
                      const [label, ...rest] = item.split("：");
                      const detail = rest.join("：");
                      return (
                        <li key={i} className="text-[#005EB8]">
                          <span className="font-medium">{label}</span>
                          {detail && <span className="text-[#333]">：{detail}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E0E3E8] bg-white px-5 py-[22px] shadow-[0px_7px_20px_0px_rgba(5,20,41,0.04)]">
            <p className="text-sm leading-relaxed text-[#333]">{PLACEHOLDER_CONTENT[activeTab]}</p>
          </div>
        )}
      </div>
    </section>
  );
}
