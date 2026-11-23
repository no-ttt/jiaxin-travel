"use client";

import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  name,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  label,
}: {
  name?: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Filter-bar style (white, 52px tall): this label sits above the selected value. */
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
          label ? "h-[52px] bg-white pl-3.5 pr-3" : "h-12 bg-[#FAFAFA] px-4"
        } ${isOpen ? "border-[1.5px] border-[#0053E0]" : "border-[#E0E3E8]"}`}
      >
        {label ? (
          // Filter-bar field (design): small label above the selected value.
          <span className="flex min-w-0 flex-col gap-0.5 leading-[1.4]">
            <span className="truncate text-xs text-[#535F71]">{label}</span>
            <span className="truncate font-medium text-[#090909]">{value || placeholder}</span>
          </span>
        ) : (
          <span className={`truncate ${value ? "text-[#0A0A0C]" : "text-[#535F71]"}`}>{value || placeholder}</span>
        )}
        {label ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path
              d="M3.5 5.25L7 8.75L10.5 5.25"
              stroke={isOpen ? "#0053E0" : "#535F71"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className={`shrink-0 transition-transform ${isOpen ? "" : "rotate-180"}`}
            aria-hidden="true"
          >
            <path
              d="M1 6.5L5 2.5L9 6.5"
              stroke={isOpen ? "#0053E0" : "#002366"}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 flex max-h-80 flex-col gap-0.5 overflow-y-auto rounded-xl border border-[#E0E3E8] bg-white p-2 shadow-[0px_8px_24px_-4px_rgba(13,20,38,0.12)]">
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`flex h-11 w-full shrink-0 cursor-pointer items-center rounded-lg px-4 text-left text-sm transition ${
                  isSelected ? "bg-[#ECF1FA] text-[#0053E0]" : "text-[#0A0A0C] hover:bg-[#F5F6F8]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
