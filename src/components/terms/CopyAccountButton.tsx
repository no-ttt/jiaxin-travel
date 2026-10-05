"use client";

import { useEffect, useState } from "react";

/** navigator.clipboard needs a secure context; fall back to a hidden textarea elsewhere. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  }
}

export default function CopyAccountButton({ accountNumber }: { accountNumber: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => setCopied(await copyText(accountNumber))}
      className="flex h-9 cursor-pointer items-center justify-center rounded-xl border border-[#0053E0] px-3.5 text-[13px] font-medium text-[#0053E0] hover:bg-[#F5F8FF]"
    >
      {copied ? "已複製" : "複製帳號"}
    </button>
  );
}
