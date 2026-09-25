"use client";

import { useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import { generateId } from "../ui/generateId";
import ToggleSwitch from "../ui/ToggleSwitch";
import RichTextEditor from "../trips/RichTextEditor";
import type { OrderFlowStep } from "./data";

export default function StepsSection({
  steps,
  onStepsChange,
}: {
  steps: OrderFlowStep[];
  onStepsChange: (steps: OrderFlowStep[]) => void;
}) {
  const [activeStepId, setActiveStepId] = useState(steps[0]?.id ?? "");

  const activeStep = steps.find((s) => s.id === activeStepId) ?? steps[0];

  const updateStep = (id: string, patch: Partial<OrderFlowStep>) => {
    onStepsChange(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeStep = (id: string) => {
    const next = steps.filter((s) => s.id !== id);
    onStepsChange(next);
    if (activeStepId === id && next.length > 0) setActiveStepId(next[0].id);
  };

  const addStep = () => {
    const newStep: OrderFlowStep = {
      id: generateId("step"),
      label: `步驟 ${steps.length + 1}`,
      visible: true,
      title: "",
      content: "",
    };
    onStepsChange([...steps, newStep]);
    setActiveStepId(newStep.id);
  };

  return (
    <section className="flex flex-col gap-5 rounded-[14px] border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">流程步驟</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">
          固定五個步驟，可個別編輯文字內容與開關顯示，對應前台「訂購流程」頁面的 Step 1～5。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[13px] font-bold leading-[1.45em] text-[#090909]">步驟管理</span>
            <span className="text-xs leading-[1.45em] text-[#535F71]">固定 5 個步驟，可個別開關顯示、編輯內容。</span>
          </div>
          <button
            type="button"
            onClick={addStep}
            className="cursor-pointer whitespace-nowrap text-xs font-medium leading-[1.45em] text-[#0053E0]"
          >
            ＋ 新增步驟
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {steps.map((step) => {
            const active = step.id === activeStepId;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 rounded-[10px] border px-3 py-2 ${
                  active ? "border-[#0053E0] bg-[#ECF1FA]" : "border-[#E0E3E8] bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveStepId(step.id)}
                  className={`cursor-pointer whitespace-nowrap text-[13px] leading-[1.45em] ${
                    active ? "font-bold text-[#0053E0]" : "font-medium text-[#090909]"
                  }`}
                >
                  {step.label}
                </button>
                <ToggleSwitch
                  size="sm"
                  checked={step.visible}
                  onChange={() => updateStep(step.id, { visible: !step.visible })}
                  label={`切換${step.label}顯示於前台`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {activeStep && (
        <div className="flex flex-col gap-4 rounded-[14px] border border-[#E0E3E8] bg-white p-[18px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold leading-[1.45em] text-[#090909]">
              目前編輯：{activeStep.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs leading-[1.45em] text-[#535F71]">切換上方步驟即可編輯其他內容</span>
              {steps.length > 1 && (
                <>
                  <span className="text-xs leading-[1.45em] text-[#535F71] opacity-50">｜</span>
                  <button
                    type="button"
                    onClick={() => removeStep(activeStep.id)}
                    className="cursor-pointer text-xs leading-[1.45em] text-[#535F71] hover:text-[#C71A1A]"
                  >
                    刪除此步驟
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[7px]">
            <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">步驟標題</span>
            <input
              type="text"
              value={activeStep.title}
              onChange={(e) => updateStep(activeStep.id, { title: e.target.value })}
              className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
            />
          </div>

          <div className="flex flex-col gap-[7px]">
            <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">內容</span>
            <RichTextEditor
              value={activeStep.content}
              onChange={(html) => updateStep(activeStep.id, { content: html })}
              placeholder="輸入前台「訂購流程」此步驟要展示的內容。可使用段落、清單與連結。"
            />
            <p className="text-xs leading-[1.45em] text-[#535F71]">
              可貼上多段文字；編輯器會保留基本段落與列表格式。
            </p>
          </div>
        </div>
      )}

      <AdminInfoNote>僅「顯示」開啟且內容已填寫的步驟會出現在前台，並依 Step 1～5 固定順序排列。</AdminInfoNote>
    </section>
  );
}
