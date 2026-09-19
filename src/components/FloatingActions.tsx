"use client";

import Image from "next/image";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-4 z-40 sm:bottom-8 sm:right-8">
      <button
        type="button"
        aria-label="回到頂部"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0px_12px_36px_4px_rgba(35,70,140,0.18)] transition hover:-translate-y-0.5"
      >
        <Image src="/images/arrow-up-icon.svg" alt="" width={24} height={24} />
      </button>
    </div>
  );
}
