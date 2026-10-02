"use client";

import { useState, type FormEvent } from "react";

type AdminPromptDialogProps = {
  title: string;
  label: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Returns an error message to show under the input, or null when the value is acceptable. */
  validate?: (value: string) => string | null;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

/** Text-input modal, styled to match AdminConfirmDialog. */
export default function AdminPromptDialog({
  title,
  label,
  placeholder,
  confirmLabel = "新增",
  cancelLabel = "取消",
  validate,
  onConfirm,
  onCancel,
}: AdminPromptDialogProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    const message = trimmed ? (validate?.(trimmed) ?? null) : "請輸入內容";
    if (message) {
      setError(message);
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-prompt-title"
        onSubmit={handleSubmit}
        className="flex w-full max-w-[360px] flex-col gap-4 rounded-2xl bg-white p-6"
      >
        <h2 id="admin-prompt-title" className="text-base font-bold leading-[1.45em] text-[#090909]">
          {title}
        </h2>
        <label className="flex flex-col gap-[7px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{label}</span>
          <input
            type="text"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder={placeholder}
            className={`h-11 w-full rounded-xl border bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none placeholder:text-[#B4BED1] focus:border-[#0053E0] ${
              error ? "border-[#C71A1A]" : "border-[#E0E3E8]"
            }`}
          />
          {error && <span className="text-xs leading-[1.45em] text-[#C71A1A]">{error}</span>}
        </label>
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] bg-white px-4 text-sm font-bold leading-[1.45em] text-[#090909] hover:bg-[#F6F6F6]"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] px-4 text-sm font-bold leading-[1.45em] text-white hover:bg-[#0047BE]"
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
