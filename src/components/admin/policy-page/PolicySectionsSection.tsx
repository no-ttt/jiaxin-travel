"use client";

import AdminAddButton from "../ui/AdminAddButton";
import AdminInfoNote from "../ui/AdminInfoNote";
import ToggleSwitch from "../ui/ToggleSwitch";
import RichTextEditor from "../trips/RichTextEditor";
import { DEFAULT_SECTION_COUNT, MAX_SECTIONS, newPolicySection, type PolicySectionDraft } from "./data";

export default function PolicySectionsSection({
  title,
  description,
  sections,
  onChange,
}: {
  title: string;
  description: string;
  sections: PolicySectionDraft[];
  onChange: (sections: PolicySectionDraft[]) => void;
}) {
  const update = (id: string, patch: Partial<PolicySectionDraft>) =>
    onChange(sections.map((section) => (section.id === id ? { ...section, ...patch } : section)));
  const remove = (id: string) => onChange(sections.filter((section) => section.id !== id));

  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">{title}</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">{description}</p>
      </div>

      {sections.map((section, index) => {
        const removable = index >= DEFAULT_SECTION_COUNT;
        return (
          <div key={section.id} className="flex flex-col gap-5">
            {index > 0 && <div className="h-px w-full bg-[#E0E3E8]" />}

            <div className="flex flex-col gap-[7px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">
                  段落標題 {index + 1}
                </span>
                <div className="flex items-center gap-3">
                  {removable && (
                    <button
                      type="button"
                      onClick={() => remove(section.id)}
                      className="flex h-10 w-[78px] cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-medium leading-[1.4em] text-[#CD5959] hover:bg-[#FDEDED]"
                    >
                      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
                        <path
                          d="M1 3H10M4 3V1.5H7V3M4.5 5.5V9M6.5 5.5V9M1.75 3L2.25 10.5C2.28 10.9 2.62 11.25 3.02 11.25H7.98C8.38 11.25 8.72 10.9 8.75 10.5L9.25 3"
                          stroke="#CD5959"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      移除
                    </button>
                  )}
                  <div className="flex h-9 items-center p-1.5">
                    <ToggleSwitch
                      checked={section.visible}
                      onChange={() => update(section.id, { visible: !section.visible })}
                      label={`段落 ${index + 1} 前台顯示`}
                    />
                  </div>
                </div>
              </div>
              <input
                type="text"
                value={section.title}
                placeholder="請輸入段落標題"
                onChange={(e) => update(section.id, { title: e.target.value })}
                className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none placeholder:text-[#535F71] focus:border-[#0053E0]"
              />
            </div>

            <div className="flex flex-col gap-[7px]">
              <RichTextEditor
                value={section.content}
                onChange={(html) => update(section.id, { content: html })}
                placeholder="（尚未輸入內容，請在此輸入段落說明文字）"
              />
              <p className="text-xs leading-[1.45em] text-[#535F71]">支援多段文字、清單與粗體；前台將依編輯器格式呈現。</p>
            </div>
          </div>
        );
      })}

      <div className="h-px w-full bg-[#E0E3E8]" />
      <AdminAddButton
        label="新增段落"
        onClick={() => onChange([...sections, newPolicySection()])}
        disabled={sections.length >= MAX_SECTIONS}
        title={sections.length >= MAX_SECTIONS ? `最多 ${MAX_SECTIONS} 個段落` : undefined}
      />

      <AdminInfoNote>
        預設四段僅提供「前台顯示」開關，可隱藏但不可刪除；透過上方「新增段落」新增的段落，標題列右側會額外顯示「移除」按鈕，可將該段整筆刪除。
      </AdminInfoNote>
    </section>
  );
}
