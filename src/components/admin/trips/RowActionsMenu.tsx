"use client";

import { useEffect, useRef, useState } from "react";

type RowActionsMenuProps = {
  onDuplicate?: () => void;
  onDelete?: () => void;
};

/** Approximate menu height (two items + padding), to decide whether it fits below the trigger. */
const MENU_HEIGHT = 92;
const MENU_GAP = 6;

export default function RowActionsMenu({ onDuplicate, onDelete }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // The table clips overflow (rounded corners), so the menu is `fixed`; it opens upward near the bottom.
  const [menuPos, setMenuPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);

  const toggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const fitsBelow = rect.bottom + MENU_GAP + MENU_HEIGHT <= window.innerHeight;
      const right = window.innerWidth - rect.right;
      setMenuPos(
        fitsBelow
          ? { top: rect.bottom + MENU_GAP, right }
          : { bottom: window.innerHeight - rect.top + MENU_GAP, right }
      );
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;
    // A fixed menu would drift from its trigger on scroll/resize; just close it.
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

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
        className="cursor-pointer text-[12px] font-bold leading-[1.45em] text-[#0053E0] hover:underline"
      >
        編輯
      </button>

      {open && menuPos && (
        <div
          style={menuPos}
          className="fixed z-30 flex w-[104px] flex-col gap-0.5 rounded-xl border border-[#E0E3E8] bg-white p-1.5 shadow-lg"
        >
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
