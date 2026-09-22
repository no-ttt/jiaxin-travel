"use client";

import { useEffect } from "react";

type AdminToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function AdminToast({ message, onClose, duration = 2500 }: AdminToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed left-1/2 top-8 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-5 py-3.5 shadow-[0px_12px_32px_-8px_rgba(13,20,38,0.18)]">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-[11px] font-bold text-white">
        ✓
      </span>
      <span className="text-sm font-medium leading-[1.45em] text-[#166534]">{message}</span>
    </div>
  );
}
