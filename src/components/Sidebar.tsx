"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buildSearchHref, themeCollectionHref } from "@/components/search/searchUrl";
import { useNavigation } from "@/lib/api/hooks/useCms";
import type { NavCategoryPublic, NavRegion, NavTheme } from "@/lib/api/types/cms";

const CLOSE_DELAY_MS = 200;

function flyoutOptionsFor(
  categoryKey: string,
  regions: NavRegion[],
  themes: NavTheme[],
): { label: string; href: string }[] {
  if (categoryKey === "overseas_group") {
    // The search page turns a destination that names a region into a region filter.
    return regions.map((region) => ({
      label: region.name,
      href: buildSearchHref({ destination: region.name, zone: "overseas_group" }),
    }));
  }
  if (categoryKey === "theme_travel") {
    return themes.map((theme) => ({ label: theme.name, href: themeCollectionHref(theme.id) }));
  }
  return [];
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const { data: navigation, isLoading } = useNavigation();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Clear hover/expanded state when the sidebar closes (adjusted during render, not in an effect).
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setHoveredKey(null);
      setExpandedKey(null);
    }
  }

  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (navRef.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[data-sidebar-toggle]")) return;
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = (key: string) => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setHoveredKey((current) => (current === key ? null : current));
    }, CLOSE_DELAY_MS);
  };

  const navClassName = `fixed left-0 top-[var(--header-height)] z-40 flex max-h-[calc(100vh-var(--header-height))] w-[85vw] max-w-[280px] flex-col gap-1 overflow-y-auto border border-l-0 border-slate-200 bg-white p-3 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.04),0px_10px_24px_-10px_rgba(0,0,0,0.03)] transition-transform duration-300 md:max-h-none md:w-[280px] md:overflow-visible ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  }`;

  if (isLoading) {
    return (
      <nav ref={navRef} aria-hidden={!isOpen} className={navClassName}>
        <span className="px-4 py-3 text-sm text-[#94969C]">載入導覽選單中…</span>
      </nav>
    );
  }

  if (!navigation || navigation.categories.length === 0) {
    return (
      <nav ref={navRef} aria-hidden={!isOpen} className={navClassName}>
        <span className="px-4 py-3 text-sm text-[#B45309]">導覽選單資料缺少（API 無回應）</span>
      </nav>
    );
  }

  return (
    <nav ref={navRef} aria-hidden={!isOpen} className={navClassName}>
      {navigation.categories.map((category: NavCategoryPublic) => {
        const isHovered = hoveredKey === category.key;
        const isExpanded = expandedKey === category.key;
        const isActive = isHovered || isExpanded;
        const options = category.submenu_enabled
          ? flyoutOptionsFor(category.key, navigation.regions, navigation.themes)
          : [];

        return (
          <div
            key={category.key}
            className="relative"
            onMouseEnter={() => {
              cancelClose();
              setHoveredKey(category.key);
            }}
            onMouseLeave={() => scheduleClose(category.key)}
          >
            <a
              href={category.submenu_enabled ? undefined : (category.redirect_url ?? "#")}
              onClick={(event) => {
                if (!category.submenu_enabled) return;
                event.preventDefault();
                setExpandedKey((current) => (current === category.key ? null : category.key));
              }}
              className={`flex h-20 cursor-pointer items-stretch gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                isActive ? "bg-[#ECF1FA] text-[#090909]" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span
                className={`w-1 shrink-0 self-stretch rounded-[20px] bg-[#0053E0] transition-opacity ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
              <span className="flex items-center">{category.display_name}</span>
            </a>

            {category.submenu_enabled && (
              <>
                {isHovered && (
                  <div className="absolute left-full top-0 z-20 ml-6 hidden w-max rounded-[18px] border border-slate-200 bg-white p-8 shadow-[0px_12px_34px_-6px_rgba(5,18,36,0.12)] md:block">
                    <h3 className="mb-6 text-xl font-bold text-[#090909]">{category.display_name}</h3>
                    {options.length > 0 ? (
                      <div className="grid grid-cols-4 gap-x-16 gap-y-6">
                        {options.map((option) => (
                          <Link
                            key={option.label}
                            href={option.href}
                            onClick={onClose}
                            className="flex cursor-pointer items-center rounded-lg border border-transparent px-3 py-2.5 text-base text-[#090909] transition-colors duration-150 hover:border-slate-200 hover:bg-slate-50 hover:text-[#0053E0]"
                          >
                            {option.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-[#94969C]">尚無子選項</span>
                    )}
                  </div>
                )}

                {isExpanded && (
                  <div className="mb-1 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 md:hidden">
                    {options.length > 0 ? (
                      options.map((option) => (
                        <Link
                          key={option.label}
                          href={option.href}
                          onClick={onClose}
                          className="flex cursor-pointer items-center rounded-lg border border-transparent px-3 py-2.5 text-sm text-[#090909] transition-colors duration-150 hover:border-slate-200 hover:bg-white hover:text-[#0053E0]"
                        >
                          {option.label}
                        </Link>
                      ))
                    ) : (
                      <span className="col-span-2 px-3 py-2.5 text-sm text-[#94969C]">尚無子選項</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
