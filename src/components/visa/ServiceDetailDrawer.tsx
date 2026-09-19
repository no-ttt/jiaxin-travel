"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ServiceRow } from "./ServiceTable";

type DrawerTab = "documents" | "notes" | "downloads";

type DocumentItem = {
  title: string;
  description?: string;
};

type DownloadItem = {
  title: string;
  description: string;
  downloadLabel: string;
};

const TABS: { id: DrawerTab; label: string }[] = [
  { id: "documents", label: "需備資料" },
  { id: "notes", label: "辦證須知" },
  { id: "downloads", label: "文件下載" },
];

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    title: "1. 身分證正本",
    description:
      "若未領身分證者，需附戶口名簿正、影本或3個月內戶籍謄本正本代替，身分證及戶口名簿正本驗畢退還須以外交部實際工作天為主。",
  },
  {
    title: "2. 6 個月內 2吋彩色白底 實體照片1張",
    description:
      "晶片護照照片規格：頭頂到下巴距離需介於3.2公分至3.6公分之間，需露耳朵、眉毛，不可露齒、不可配戴粗框或有色鏡片之眼鏡，不得使用合成照片。",
  },
  { title: "3. 委任書" },
  {
    title: "4. 舊護照正本",
    description: "首次申請免附；換發或部分情況需檢附。",
  },
];

const DEFAULT_NOTES = [
  {
    title: "1. 身分證正本",
    description:
      "此辦證項目為年滿14歲之申請者辦理\n首次辦理護照需已做人別確認的簡式護照資料表才能代送\n役男【115年度為96年次~79年次出生尚未當兵之男子，含僑民役男】、國軍人員及替代現役出國須申請出境核准\n辦證天數：約 11 個工作天（代辦約加6個工作天）\n辦證費用：TWD 1,800\n入境可停留天數：由移民官決定\n效期及入境次數：以外交部核發為準最長10年\n備註:\n為收齊證件後一日開始申辦證照流程 需要辦理天數為辦證天數加上代辦工作天，不含繳件日及證照寄回指定取件人之日期 如遇特殊原因，將以服務人員與您聯繫為主",
  },
  {
    title: "委任書",
    description:
      "★護照委任書說明\n‧本人(申請者或監護人)親自送件給旅行社辦證，請填寫『D式委任書』 D式委任書-未成年監護人委任範例：7歲以上未滿18歲且未婚者，由監護人委任旅行社辦證 E式委任書-成年者範例：年滿18歲以上或未滿18歲但已結婚者，本人以複委託方式由親屬、同事、同學委託旅行社辦證 E式委任書-未成年直接委任範例：7歲以上未滿18歲且未婚者，由監護人同意申請人自行以複委託方式由親屬、同事、同學委託旅行社辦證\n‧若申請人為7歲以上未滿18歲且未婚者，可由 -「監護人」委任或以複委託方式送件給旅行社辦證 -或監護人同意「申請者」自行委任或以複委託方式送件給旅行社辦證\n‧若申請人為未滿7歲或受監護宣告者 -只能由「監護人」委任或以複委託方式送件給旅行社辦證",
  },
];

const DEFAULT_DOWNLOADS: DownloadItem[] = [
  {
    title: "護照申請書",
    description: "首次申辦或效期已過須換發者，請下載並填寫本申請書，連同其他文件一併送件。",
    downloadLabel: "下載護照申請書",
  },
  {
    title: "簡式護照資料表",
    description: "首次辦理護照者，需檢附已完成人別確認之簡式護照資料表，方能代為送件。",
    downloadLabel: "下載簡式護照資料表",
  },
  {
    title: "D 式委任書",
    description: "未成年申請人（7 歲以上未滿 18 歲且未婚）由監護人委任本公司辦證時使用。",
    downloadLabel: "下載 D 式委任書",
  },
  {
    title: "E 式委任書",
    description: "已成年申請人，或監護人同意由申請人自行複委託親屬、同事、同學送件時使用。",
    downloadLabel: "下載 E 式委任書",
  },
];

export default function ServiceDetailDrawer({
  row,
  onClose,
}: {
  row: ServiceRow | null;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("documents");

  useEffect(() => {
    if (row) setActiveTab("documents");
  }, [row]);

  useEffect(() => {
    if (!row) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [row, onClose]);

  const isOpen = row !== null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-[680px] flex-col overflow-y-auto bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0 shadow-[-12px_0px_36px_0px_rgba(5,20,41,0.18)]" : "translate-x-full shadow-none"
        }`}
      >
        {row && (
          <div className="flex flex-col gap-5 px-6 pb-7 pt-8 sm:px-10 sm:pt-[100px]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex max-w-[500px] flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0053E0]">
                  PASSPORT SERVICE
                </span>
                <h2 className="font-serif text-xl font-bold leading-[1.45] text-[#090909] sm:text-[25px]">
                  {row.item}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="關閉"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#E0E3E8] bg-[#FAFAFA] hover:bg-white"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M5 5L15 15M15 5L5 15"
                    stroke="#535F71"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <QuickFact label="辦理天數" value={row.duration} />
              <QuickFact label="代辦費用" value={row.fee} isAccent />
              <QuickFact label="證件效期" value={row.validity} />
            </div>

            <div className="flex rounded-t-2xl border-b border-[#E0E3E8] bg-[#F8FAFC]">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex h-12 w-[200px] max-w-[33.33%] cursor-pointer items-center justify-center px-5 text-sm tracking-[0.0571em] ${
                    activeTab === tab.id
                      ? "border-b-[3px] border-[#0053E0] bg-[#ECF1FA] font-bold text-[#002366]"
                      : "font-medium text-[#535F71] hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div>
              {activeTab === "documents" && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-lg font-bold text-[#090909] sm:text-xl">
                    需準備文件清單
                  </h3>
                  <div className="flex flex-col">
                    {DEFAULT_DOCUMENTS.map((doc) => (
                      <div
                        key={doc.title}
                        className="flex flex-col gap-1 border-b border-[#E0E3E8] py-5 last:border-b-0"
                      >
                        <p className="text-sm font-bold leading-[1.5] text-[#090909]">
                          {doc.title}
                        </p>
                        {doc.description && (
                          <p className="text-[13px] leading-[1.6] text-[#535F71]">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-lg font-bold text-[#090909] sm:text-xl">
                    辦證須知
                  </h3>
                  <div className="flex flex-col">
                    {DEFAULT_NOTES.map((note) => (
                      <div
                        key={note.title}
                        className="flex flex-col gap-1 border-b border-[#E0E3E8] py-5 last:border-b-0"
                      >
                        <p className="text-sm font-bold leading-[1.5] text-[#090909]">
                          {note.title}
                        </p>
                        <p className="whitespace-pre-line text-[13px] leading-[1.6] text-[#535F71]">
                          {note.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "downloads" && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-lg font-bold text-[#090909] sm:text-xl">
                    文件下載
                  </h3>
                  <div className="flex flex-col">
                    {DEFAULT_DOWNLOADS.map((doc) => (
                      <div
                        key={doc.title}
                        className="flex h-[118px] flex-col gap-1 border-b border-[#E0E3E8] py-2 last:border-b-0"
                      >
                        <p className="text-sm font-bold leading-[1.5] text-[#090909]">
                          {doc.title}
                        </p>
                        <p className="text-[13px] leading-[1.6] text-[#535F71]">
                          {doc.description}
                        </p>
                        <div className="flex gap-2.5 pt-1">
                          <button
                            type="button"
                            className="flex h-[38px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[#C3C6D6] bg-white px-5 text-xs font-medium text-[#0053E0] hover:bg-[#F5F8FF]"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                              <path
                                d="M8 2V10M8 10L5 7M8 10L11 7M3 13H13"
                                stroke="#0053E0"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {doc.downloadLabel}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-[18px] bg-[#ECF1FA] p-5 sm:p-[18px_20px]">
              <h3 className="font-serif text-lg font-bold text-[#090909]">準備好資料了嗎？</h3>
              <p className="text-[13px] leading-[1.55] text-[#535F71]">
                直接聯繫專人幫您核對文件與送件方式。
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#"
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0053E0] text-[13px] font-bold text-white hover:bg-[#0047c2]"
                >
                  <Image src="/images/visa-chat-icon.svg" alt="" width={18} height={18} />
                  LINE 線上預約
                </a>
                <a
                  href="tel:"
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#0053E0] bg-white text-[13px] font-bold text-[#0053E0] hover:bg-[#F5F8FF]"
                >
                  <Image src="/images/phone-call.svg" alt="" width={18} height={18} />
                  電話諮詢
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickFact({
  label,
  value,
  isAccent = false,
}: {
  label: string;
  value: string;
  isAccent?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-[#F6F6F6] p-4">
      <span className="text-xs text-[#535F71]">{label}</span>
      <span
        className={`text-base font-bold text-[#090909] ${isAccent ? "font-['TASA_Orbiter',_sans-serif] text-lg" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
