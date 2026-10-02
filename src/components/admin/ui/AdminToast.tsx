"use client";

import { useEffect } from "react";

type AdminToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
  variant?: "success" | "warning";
};

const VARIANT_STYLES = {
  success: {
    box: "border-[#BBF7D0] bg-[#F0FDF4]",
    icon: "bg-[#16A34A]",
    text: "text-[#166534]",
    symbol: "✓",
  },
  warning: {
    box: "border-[#FDE68A] bg-[#FFFBEB]",
    icon: "bg-[#D97706]",
    text: "text-[#92400E]",
    symbol: "!",
  },
};

export default function AdminToast({
  message,
  onClose,
  duration = 2500,
  variant = "success",
}: AdminToastProps) {
  const styles = VARIANT_STYLES[variant];

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`fixed left-1/2 top-8 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-xl border ${styles.box} px-5 py-3.5 shadow-[0px_12px_32px_-8px_rgba(13,20,38,0.18)]`}>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${styles.icon} text-[11px] font-bold text-white`}
      >
        {styles.symbol}
      </span>
      <span className={`text-sm font-medium leading-[1.45em] ${styles.text}`}>{message}</span>
    </div>
  );
}
