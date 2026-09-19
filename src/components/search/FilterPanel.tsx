import { FILTER_SECTIONS } from "./filters";

function Checkbox({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border border-[#0053E0] bg-[#0053E0]">
        <span className="text-[11px] font-medium text-white">✓</span>
      </div>
    );
  }
  return <div className="h-[18px] w-[18px] shrink-0 rounded-[5px] border border-[#C3C6D6] bg-white" />;
}

export default function FilterPanel({
  selected,
  onToggle,
  onClear,
}: {
  selected: Set<string>;
  onToggle: (option: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex w-[252px] shrink-0 flex-col gap-[22px] rounded-2xl border border-[#E0E3E8] bg-white px-[22px] pb-5 pt-[22px] shadow-[0px_8px_24px_0px_rgba(5,20,41,0.04)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#090909]">篩選條件</h3>
        <span className="text-xs font-medium text-[#0053E0]">已選 {selected.size}</span>
      </div>

      {FILTER_SECTIONS.map((section, i) => (
        <div key={section.id} className="contents">
          {i > 0 && <div className="h-px w-full bg-[#E0E3E8]" />}
          <div className="flex flex-col gap-[9px]">
            <span className="text-[13px] font-bold text-[#090909]">{section.title}</span>
            {section.options.map((option) => {
              const checked = selected.has(option);
              return (
                <label key={option} className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(option)}
                    className="sr-only"
                  />
                  <Checkbox checked={checked} />
                  <span className={`text-sm ${checked ? "text-[#090909]" : "text-[#535F71]"}`}>
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onClear}
        className="flex h-[38px] w-full cursor-pointer items-center justify-center rounded-[10px] border border-[#C3C6D6] text-sm font-medium text-[#0053E0]"
      >
        清除全部條件
      </button>
    </div>
  );
}
