"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [{ label: "關於我們", href: "#about" }];

export default function Header({
  isSidebarOpen,
  onToggleSidebar,
}: {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const setHeaderHeightVar = () => {
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    };

    setHeaderHeightVar();
    const observer = new ResizeObserver(setHeaderHeightVar);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-white px-4 py-3 shadow-[4px_4px_12px_0px_rgba(0,0,0,0.15)] sm:gap-8 sm:px-8"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="開啟選單"
          aria-expanded={isSidebarOpen}
          onClick={onToggleSidebar}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center sm:h-10 sm:w-10"
        >
          <Image src="/images/nav-left-icon.svg" alt="" width={40} height={40} className="h-full w-full" />
        </button>

        <Link href="/" className="flex min-w-0 shrink cursor-pointer items-center gap-1 px-1 py-1.5 sm:px-3">
          <span className="relative h-10 w-[57px] shrink-0 sm:h-16 sm:w-[91px]">
            <Image
              src="/images/logo-mark.png"
              alt=""
              fill
              className="object-contain"
              priority
            />
          </span>
          <span className="relative h-8 w-20 shrink-0 sm:h-[53px] sm:w-[132px]">
            <Image
              src="/images/logo-text.png"
              alt="嘉新旅行社 Chia Hsin Travel"
              fill
              className="object-contain"
              priority
            />
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex md:flex-1 md:items-stretch md:justify-end">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl px-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="cursor-pointer px-2 text-base leading-8 text-[#3D3D3D] hover:text-black"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <a href="tel:" aria-label="撥打電話" className="flex h-8 w-8 cursor-pointer items-center justify-center sm:h-10 sm:w-10">
          <Image src="/images/phone-call.svg" alt="" width={40} height={40} className="h-full w-full" />
        </a>
        <a
          href="#"
          aria-label="LINE 聯絡我們"
          className="hidden h-10 w-10 cursor-pointer items-center justify-center sm:flex"
        >
          <Image src="/images/nav-circle-icon.svg" alt="" width={40} height={40} />
        </a>
      </div>
    </header>
  );
}
