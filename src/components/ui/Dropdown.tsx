"use client";

import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  name,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
}: {
  name?: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
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
        className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border bg-[#FAFAFA] px-4 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isOpen ? "border-[1.5px] border-[#0053E0]" : "border-[#E0E3E8]"
        }`}
      >
        <span className={value ? "text-[#0A0A0C]" : "text-[#535F71]"}>{value || placeholder}</span>
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
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 flex flex-col gap-0.5 rounded-xl border border-[#E0E3E8] bg-white p-2 shadow-[0px_8px_24px_-4px_rgba(13,20,38,0.12)]">
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
                className={`flex h-11 w-full cursor-pointer items-center rounded-lg px-4 text-left text-sm transition ${
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
