"use client";

import { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "./ChevronDownIcon";
import type { FilterOption } from "./data";

type FilterDropdownProps = {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
};

export default function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = selected.length > 0;

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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[13px] leading-[1.45em] transition ${
          active
            ? "border-[#0053E0] bg-white font-bold text-[#0053E0] hover:bg-[#ECF1FA]"
            : "border-[#E0E3E8] bg-white font-medium text-[#002366] hover:border-[#0053E0]"
        }`}
      >
        <span>
          {label}
          {active ? `（${selected.length}）` : ""}
        </span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 flex w-[200px] flex-col gap-0.5 rounded-xl border border-[#E0E3E8] bg-white p-2 shadow-lg">
          {options.map((option) => {
            const checked = selected.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[13px] leading-[1.45em] text-[#090909] hover:bg-[#ECF1FA]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option.value)}
                  className="h-4 w-4 cursor-pointer accent-[#0053E0]"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
