"use client";

import { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "./ChevronDownIcon";

type AdminSelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function AdminSelect({ options, value, onChange }: AdminSelectProps) {
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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-[#E0E3E8] bg-white px-3.5 text-left outline-none focus:border-[#0053E0]"
      >
        <span className="text-sm font-medium leading-[1.45em] text-[#090909]">{value}</span>
        <ChevronDownIcon className="shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 flex max-h-64 w-full min-w-[160px] flex-col gap-0.5 overflow-y-auto rounded-xl border border-[#E0E3E8] bg-white p-2 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`cursor-pointer rounded-lg px-2 py-2 text-left text-[13px] leading-[1.45em] hover:bg-[#ECF1FA] ${
                option === value ? "font-bold text-[#0053E0]" : "text-[#090909]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
