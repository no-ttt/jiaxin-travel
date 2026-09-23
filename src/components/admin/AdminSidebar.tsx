"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "./nav-items";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[268px] shrink-0 flex-col gap-7 overflow-y-auto border-r border-[#E0E3E8] bg-[#F6F6F6] px-8 py-[30px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="relative h-10 w-[57px] shrink-0">
            <Image src="/images/logo-mark.png" alt="" fill className="object-contain" priority />
          </span>
          <span className="relative h-8 w-20 shrink-0">
            <Image
              src="/images/logo-text.png"
              alt="嘉新旅行社 Chia Hsin Travel"
              fill
              className="object-contain"
              priority
            />
          </span>
        </div>
        <p className="text-xs font-normal leading-[1.3em] tracking-[0.1em] text-[#535F71]">
          Management Dashboard
        </p>
      </div>

      <nav className="flex flex-col gap-1.5">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-11 items-center rounded-[10px] px-3 text-[16px] font-medium leading-[1.45em] transition-colors ${
                isActive ? "bg-[#DBE8FF] text-[#0053E0]" : "text-[#535F71] hover:bg-[#ECF1FA]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#DBE8FF] py-3.5 text-[15px] font-bold leading-[1.4em] text-[#0053E0] transition hover:bg-[#B4BED1]"
      >
        <span className="text-lg leading-none">＋</span>
        <span>新增行程</span>
      </button>

      <div className="flex-1" />

      <div className="flex flex-col gap-1">
        <button
          type="button"
          className="flex h-10 cursor-pointer items-center gap-2.5 rounded-[10px] pl-3 text-left text-sm font-medium leading-[1.4em] text-[#535F71] transition hover:bg-[#ECF1FA]"
        >
          <Image src="/images/admin/icon-logout.svg" alt="" width={20} height={20} />
          登出
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-[10px] bg-white p-3">
        <p className="text-[11px] leading-[1.4em] text-[#535F71]">
          最後更新：2026/06/01 14:35
        </p>
        <p className="text-[11px] font-medium leading-[1.4em] text-[#090909]">
          Admin User · ID 08844
        </p>
      </div>
    </aside>
  );
}
