"use client";

import { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "./ChevronDownIcon";

type TagMultiSelectProps = {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export default function TagMultiSelect({
  options,
  selected,
  onChange,
  placeholder = "請選擇",
}: TagMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleOption = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const removeValue = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-[#E0E3E8] bg-white px-3.5 text-left outline-none focus:border-[#0053E0]"
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selected.length === 0 ? (
            <span className="text-sm font-medium leading-[1.45em] text-[#535F71]">{placeholder}</span>
          ) : (
            selected.map((value) => (
              <span
                key={value}
                className="flex items-center gap-1 rounded-[13px] bg-[#ECF1FA] px-2.5 py-1 text-xs font-medium leading-[1.45em] text-[#002366]"
              >
                {value}
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(value);
                  }}
                  className="cursor-pointer leading-none text-[#535F71] hover:text-[#090909]"
                >
                  ×
                </span>
              </span>
            ))
          )}
        </span>
        <ChevronDownIcon className="shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 flex max-h-64 w-full min-w-[200px] flex-col gap-0.5 overflow-y-auto rounded-xl border border-[#E0E3E8] bg-white p-2 shadow-lg">
          {options.map((option) => {
            const checked = selected.includes(option);
            return (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[13px] leading-[1.45em] text-[#090909] hover:bg-[#ECF1FA]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option)}
                  className="h-4 w-4 cursor-pointer accent-[#0053E0]"
                />
                {option}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
