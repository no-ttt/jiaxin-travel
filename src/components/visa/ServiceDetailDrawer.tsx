"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useFooter } from "@/lib/api/hooks/useCms";
import type { VisaDownload, VisaServiceDetail } from "@/lib/api/types/cms";
import { isBlankHtml } from "@/lib/html";
import type { ServiceRow } from "./ServiceTable";

type DrawerTab = "documents" | "notes" | "downloads";

const TAB_LABELS: Record<DrawerTab, string> = {
  documents: "需備資料",
  notes: "辦證須知",
  downloads: "文件下載",
};

function visibleTabs(detail: VisaServiceDetail): DrawerTab[] {
  const tabs: DrawerTab[] = [];
  if (detail.required_docs_visible) tabs.push("documents");
  if (detail.notice_visible) tabs.push("notes");
  if (detail.downloads_visible) tabs.push("downloads");
  return tabs;
}

const HTML_CLASS =
  "text-[13px] leading-[1.6] text-[#535F71] [&_a]:text-[#0053E0] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5";

export default function ServiceDetailDrawer({
  row,
  onClose,
}: {
  row: ServiceRow | null;
  onClose: () => void;
}) {
  const { data: footer } = useFooter();
  const tabs = row ? visibleTabs(row.detail) : [];
  const [activeTab, setActiveTab] = useState<DrawerTab | null>(null);

  // Open each service on its first visible tab.
  const [prevRow, setPrevRow] = useState(row);
  if (row !== prevRow) {
    setPrevRow(row);
    if (row) setActiveTab(visibleTabs(row.detail)[0] ?? null);
  }

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
                  {row.kind === "passport" ? "PASSPORT SERVICE" : "VISA SERVICE"}
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

            {tabs.length > 0 && (
              <div className="flex rounded-t-2xl border-b border-[#E0E3E8] bg-[#F8FAFC]">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex h-12 w-[200px] max-w-[33.33%] cursor-pointer items-center justify-center px-5 text-sm tracking-[0.0571em] ${
                      activeTab === tab
                        ? "border-b-[3px] border-[#0053E0] bg-[#ECF1FA] font-bold text-[#002366]"
                        : "font-medium text-[#535F71] hover:text-slate-700"
                    }`}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>
            )}

            <div>
              {activeTab === "documents" && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-lg font-bold text-[#090909] sm:text-xl">
                    {row.detail.required_docs_title || TAB_LABELS.documents}
                  </h3>
                  {row.detail.required_docs.length > 0 && (
                    <div className="flex flex-col">
                      {row.detail.required_docs.map((doc, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-[5px] border-b border-[#E0E3E8] pb-5 pt-2"
                        >
                          <p className="text-sm font-bold leading-[1.5] text-[#090909]">{doc.title}</p>
                          {!isBlankHtml(doc.body_html) && (
                            <div className={HTML_CLASS} dangerouslySetInnerHTML={{ __html: doc.body_html }} />
                          )}
                          {doc.downloads.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 pt-2">
                              {doc.downloads.map((file, j) => (
                                <DownloadButton key={j} file={file} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "notes" && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-lg font-bold text-[#090909] sm:text-xl">
                    {row.detail.notice_title || TAB_LABELS.notes}
                  </h3>
                  <div className="flex flex-col">
                    {row.detail.notice_docs.map((doc, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-[5px] border-b border-[#E0E3E8] pb-5 pt-2"
                      >
                        {doc.title && (
                          <p className="text-sm font-bold leading-[1.5] text-[#090909]">{doc.title}</p>
                        )}
                        {!isBlankHtml(doc.body_html) && (
                          <div className={HTML_CLASS} dangerouslySetInnerHTML={{ __html: doc.body_html }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "downloads" && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-lg font-bold text-[#090909] sm:text-xl">
                    {TAB_LABELS.downloads}
                  </h3>
                  <div className="flex flex-col">
                    {row.detail.downloads.map((file, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-[5px] border-b border-[#E0E3E8] pb-5 pt-2"
                      >
                        {file.title && (
                          <p className="text-sm font-bold leading-[21px] text-[#090909]">{file.title}</p>
                        )}
                        {file.description && (
                          <p className="text-[13px] leading-[21px] text-[#535F71]">{file.description}</p>
                        )}
                        <div className="flex gap-2.5">
                          <DownloadButton file={file} />
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
                  href={footer?.line_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0053E0] text-[13px] font-bold text-white hover:bg-[#0047c2]"
                >
                  <Image src="/images/visa-chat-icon.svg" alt="" width={18} height={18} />
                  LINE 線上預約
                </a>
                <a
                  href={footer?.phone ? `tel:${footer.phone}` : "#"}
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

function DownloadButton({ file }: { file: VisaDownload }) {
  if (!file.url) return null;
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="flex h-[38px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#C3C6D6] bg-white px-5 text-xs font-medium text-[#0053E0] hover:bg-[#F5F8FF]"
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
      {file.label}
    </a>
  );
}
