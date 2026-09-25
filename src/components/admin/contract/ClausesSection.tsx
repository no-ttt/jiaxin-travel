"use client";

import AdminInfoNote from "../ui/AdminInfoNote";
import RichTextEditor from "../trips/RichTextEditor";
import type { ContractClause } from "./data";

export default function ClausesSection({
  clauses,
  onClausesChange,
}: {
  clauses: ContractClause[];
  onClausesChange: (clauses: ContractClause[]) => void;
}) {
  const updateClause = (id: string, patch: Partial<ContractClause>) => {
    onClausesChange(clauses.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">契約條款內容</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">
          編輯契約成立條件、重要條款摘要與簽署方式，依序對應前台「旅遊契約書」頁籤中段的三個段落。
        </p>
      </div>

      {clauses.map((clause, index) => (
        <div key={clause.id} className="flex flex-col gap-5">
          {index > 0 && <div className="h-px w-full bg-[#E0E3E8]" />}

          <div className="flex flex-col gap-[7px]">
            <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">
              段落標題 {index + 1}
            </span>
            <input
              type="text"
              value={clause.title}
              onChange={(e) => updateClause(clause.id, { title: e.target.value })}
              className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
            />
          </div>

          <div className="flex flex-col gap-[7px]">
            <RichTextEditor
              value={clause.content}
              onChange={(html) => updateClause(clause.id, { content: html })}
              placeholder="輸入前台「旅遊契約書」此段落要展示的內容。可使用段落、清單與連結。"
            />
            <p className="text-xs leading-[1.45em] text-[#535F71]">
              可貼上多段文字；編輯器會保留基本段落與列表格式。
            </p>
          </div>
        </div>
      ))}

      <AdminInfoNote>以上三段內容依序對應「旅遊契約書」頁籤中段的條款區塊，段落間以分隔線區隔。</AdminInfoNote>
    </section>
  );
}
