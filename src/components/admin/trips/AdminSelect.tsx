"use client";

import { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "./ChevronDownIcon";

type AdminSelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  /**
   * "compact" matches table cells (e.g. the compact AdminDateField);
   * "field" matches AdminTextInput (gray fill, rounded-xl) for use beside text inputs.
   */
  size?: "default" | "compact" | "field";
  ariaLabel?: string;
};

export default function AdminSelect({
  options,
  value,
  onChange,
  size = "default",
  ariaLabel,
}: AdminSelectProps) {
  const triggerClass = {
    compact: "h-9 gap-1 rounded-lg border-[#E0E3E8] bg-[#FAFAFA] px-2",
    field: "h-11 gap-2 rounded-xl border-[#E0E3E8] bg-[#FAFAFA] px-4",
    default: "h-11 gap-2 rounded-lg border-[#E0E3E8] bg-white px-3.5",
  }[size];
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Compact selects live in scrollable tables, so their menu is `fixed` (not clipped by overflow).
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const toggle = () => {
    if (!open && size === "compact" && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open || size !== "compact") return;
    // A fixed menu would drift from its trigger on scroll/resize; just close it.
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open, size]);

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
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center justify-between border text-left outline-none focus:border-[#0053E0] ${triggerClass}`}
      >
        <span className="truncate whitespace-nowrap text-sm font-medium leading-[1.45em] text-[#090909]">
          {value}
        </span>
        <ChevronDownIcon className="shrink-0" />
      </button>

      {open && (
        <div
          role="listbox"
          style={size === "compact" && menuPos ? { top: menuPos.top, left: menuPos.left, width: menuPos.width } : undefined}
          className={`z-20 flex max-h-64 flex-col gap-0.5 overflow-y-auto rounded-xl border border-[#E0E3E8] bg-white p-2 shadow-lg ${
            size === "compact" ? "fixed min-w-[96px]" : "absolute left-0 top-[calc(100%+6px)] w-full min-w-[160px]"
          }`}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`cursor-pointer whitespace-nowrap rounded-lg px-2 py-2 text-left text-[13px] leading-[1.45em] hover:bg-[#ECF1FA] ${
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
