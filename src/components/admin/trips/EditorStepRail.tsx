"use client";

import { EDITOR_STEPS, type EditorStepKey } from "./editor-steps";

type EditorStepRailProps = {
  activeStep: EditorStepKey;
  onSelect: (step: EditorStepKey) => void;
};

export default function EditorStepRail({ activeStep, onSelect }: EditorStepRailProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#E0E3E8] bg-white p-2">
      <div className="flex w-max items-center gap-2">
        {EDITOR_STEPS.map((step) => {
          const isActive = step.key === activeStep;
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onSelect(step.key)}
              className={`flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] px-5 text-[13px] font-bold leading-[1.45em] transition ${
                isActive ? "bg-[#DBE8FF] text-[#0053E0]" : "text-[#535F71] hover:bg-[#ECF1FA]"
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
