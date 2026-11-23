"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  buildSearchHref,
  themeCollectionHref,
} from "@/components/search/searchUrl";
import { useNavigation } from "@/lib/api/hooks/useCms";
import type { Navigation, NavCategoryPublic } from "@/lib/api/types/cms";

const CLOSE_DELAY_MS = 200;

function flyoutOptionsFor(
  categoryKey: string,
  navigation: Navigation,
): { label: string; href: string }[] {
  if (categoryKey === "overseas_group") {
    // The search page turns a destination that names a region into a region filter.
    return navigation.regions.map((region) => ({
      label: region.name,
      href: buildSearchHref({
        destination: region.name,
        zone: "overseas_group",
      }),
    }));
  }
  if (categoryKey === "theme_travel") {
    return navigation.themes.map((theme) => ({
      label: theme.name,
      href: themeCollectionHref(theme.id),
    }));
  }
  if (categoryKey === "premium") {
    // The name goes into the search box as the keyword; the search page turns a keyword that
    // names a subcategory into that subcategory's filter.
    return (navigation.premium_subcategories ?? []).map((sub) => ({
      label: sub.name,
      href: buildSearchHref({ keyword: sub.name, zone: "premium" }),
    }));
  }
  return [];
}

/** External 導向網址 (e.g. the flight partner) open in a new tab. */
const isExternalHref = (href: string | null) =>
  Boolean(href && /^https?:\/\//i.test(href));

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
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  // The flyout hangs off the nav (not its item) so the scrolling list doesn't clip it.
  const [flyoutTop, setFlyoutTop] = useState(0);

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

  const updateFlyoutTop = (key: string | null) => {
    const nav = navRef.current;
    const item = key ? itemRefs.current.get(key) : null;
    if (!nav || !item) return;
    setFlyoutTop(
      item.getBoundingClientRect().top -
        nav.getBoundingClientRect().top -
        nav.clientTop,
    );
  };

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

  // Spans from under the header to the bottom of the viewport on every screen size.
  const navClassName = `fixed bottom-0 left-0 top-[var(--header-height)] z-40 w-[85vw] max-w-[280px] border border-l-0 border-slate-200 bg-white shadow-[0px_2px_10px_0px_rgba(0,0,0,0.04),0px_10px_24px_-10px_rgba(0,0,0,0.03)] transition-transform duration-300 md:w-[280px] ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  }`;
  // Scrolls when the categories outgrow the viewport.
  const listClassName = "flex h-full flex-col gap-1 overflow-y-auto p-3";

  if (isLoading) {
    return (
      <nav ref={navRef} aria-hidden={!isOpen} className={navClassName}>
        <div className={listClassName}>
          <span className="px-4 py-3 text-sm text-[#94969C]">
            載入導覽選單中…
          </span>
        </div>
      </nav>
    );
  }

  if (!navigation || navigation.categories.length === 0) {
    return (
      <nav ref={navRef} aria-hidden={!isOpen} className={navClassName}>
        <div className={listClassName}>
          <span className="px-4 py-3 text-sm text-[#B45309]">
            導覽選單資料缺少（API 無回應）
          </span>
        </div>
      </nav>
    );
  }

  return (
    <nav ref={navRef} aria-hidden={!isOpen} className={navClassName}>
      <div
        className={listClassName}
        onScroll={() => updateFlyoutTop(hoveredKey)}
      >
        {navigation.categories.map((category: NavCategoryPublic) => {
          const isHovered = hoveredKey === category.key;
          const isExpanded = expandedKey === category.key;
          const isActive = isHovered || isExpanded;
          const options = category.submenu_enabled
            ? flyoutOptionsFor(category.key, navigation)
            : [];
          // A submenu with nothing in it isn't shown; the item then works like one without a submenu.
          const hasSubmenu = options.length > 0;

          return (
            <div
              key={category.key}
              ref={(el) => {
                if (el) itemRefs.current.set(category.key, el);
                else itemRefs.current.delete(category.key);
              }}
              onMouseEnter={() => {
                cancelClose();
                setHoveredKey(category.key);
                updateFlyoutTop(category.key);
              }}
              onMouseLeave={() => scheduleClose(category.key)}
              // Desktop: items share the menu's height (80px each at most, 48px at least), so the
              // menu fits the screen without scrolling; it only scrolls below that.
              className="md:flex md:max-h-20 md:min-h-12 md:flex-1 md:basis-0 md:flex-col"
            >
              {/* In-site 導向網址 use <Link> (client-side page change, no full reload); 子選單 items only expand. */}
              {!hasSubmenu && category.redirect_url?.startsWith("/") ? (
                <Link
                  href={category.redirect_url}
                  onClick={onClose}
                  className={`flex h-20 cursor-pointer items-stretch gap-3 rounded-xl px-4 py-3 text-base md:h-auto md:flex-1 md:py-2 font-medium transition-colors ${
                    isActive
                      ? "bg-[#ECF1FA] text-[#090909]"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-1 shrink-0 self-stretch rounded-[20px] bg-[#0053E0] transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="flex items-center">
                    {category.display_name}
                  </span>
                </Link>
              ) : (
                <a
                  // 子選單 only decides whether the item expands; otherwise it goes to 後台「導向網址」.
                  href={hasSubmenu ? undefined : category.redirect_url || "#"}
                  {...(!hasSubmenu && isExternalHref(category.redirect_url)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  onClick={(event) => {
                    if (!hasSubmenu) return;
                    event.preventDefault();
                    setExpandedKey((current) =>
                      current === category.key ? null : category.key,
                    );
                  }}
                  className={`flex h-20 cursor-pointer items-stretch gap-3 rounded-xl px-4 py-3 text-base md:h-auto md:flex-1 md:py-2 font-medium transition-colors ${
                    isActive
                      ? "bg-[#ECF1FA] text-[#090909]"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-1 shrink-0 self-stretch rounded-[20px] bg-[#0053E0] transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="flex items-center">
                    {category.display_name}
                  </span>
                </a>
              )}

              {hasSubmenu && (
                <>
                  {isHovered && (
                    <div
                      style={{ top: flyoutTop }}
                      className="absolute left-full z-20 ml-3 hidden w-max rounded-[18px] border border-slate-200 bg-white p-8 shadow-[0px_12px_34px_-6px_rgba(5,18,36,0.12)] md:block"
                    >
                      <h3 className="mb-6 text-xl font-bold text-[#090909]">
                        {category.display_name}
                      </h3>
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
                    </div>
                  )}

                  {isExpanded && (
                    <div className="mb-1 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 md:hidden">
                      {options.map((option) => (
                        <Link
                          key={option.label}
                          href={option.href}
                          onClick={onClose}
                          className="flex cursor-pointer items-center rounded-lg border border-transparent px-3 py-2.5 text-sm text-[#090909] transition-colors duration-150 hover:border-slate-200 hover:bg-white hover:text-[#0053E0]"
                        >
                          {option.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
