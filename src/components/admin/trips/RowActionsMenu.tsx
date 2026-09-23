"use client";

import { useEffect, useRef, useState } from "react";

type RowActionsMenuProps = {
  onDuplicate?: () => void;
  onDelete?: () => void;
};

export default function RowActionsMenu({ onDuplicate, onDelete }: RowActionsMenuProps) {
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
        className="cursor-pointer text-[12px] font-bold leading-[1.45em] text-[#0053E0] hover:underline"
      >
        編輯
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-20 flex w-[104px] flex-col gap-0.5 rounded-xl border border-[#E0E3E8] bg-white p-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => {
              onDuplicate?.();
              setOpen(false);
            }}
            className="cursor-pointer rounded-lg px-2.5 py-2 text-left text-[13px] font-medium leading-[1.45em] text-[#090909] hover:bg-[#ECF1FA]"
          >
            複製
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete?.();
              setOpen(false);
            }}
            className="cursor-pointer rounded-lg px-2.5 py-2 text-left text-[13px] font-medium leading-[1.45em] text-[#C71A1A] hover:bg-[#FDEDED]"
          >
            刪除
          </button>
        </div>
      )}
    </div>
  );
}
