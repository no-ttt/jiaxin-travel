"use client";

import Image from "next/image";
import Link from "next/link";
import { useFooter } from "@/lib/api/hooks/useCms";

const SOCIAL_LINK_DEFS = [
  { id: "facebook", icon: "/images/footer-social-1.svg", label: "Facebook" },
  { id: "instagram", icon: "/images/footer-social-2.svg", label: "Instagram" },
  { id: "line", icon: "/images/footer-social-3.svg", label: "LINE" },
] as const;

/** Light is the site default; dark follows the "Footer Minimal - Dark" design (主題集合頁). */
const PALETTES = {
  light: {
    footer: "border-[#D6DEE8] bg-[#EBF4FF]",
    logoCard: "",
    brand: "text-[#1A1C1E]",
    legal: "text-[#616E80]",
    social: "bg-white",
    contactIcon: "",
    contactText: "text-[#334155]",
    divider: "bg-[#D6DEE8]",
    copyright: "text-[#738091]",
    link: "text-[#0053E0]",
    linkDivider: "bg-[#C7CFD9]",
    muted: "text-[#94969C]",
  },
  dark: {
    footer: "border-[#334155] bg-[#0F172A]",
    logoCard:
      "rounded-xl border border-white/10 bg-[#222A3B] px-4 py-3 shadow-[0px_4px_14px_0px_rgba(0,0,0,0.3)]",
    brand: "text-[#F8FAFC]",
    legal: "text-[#CBD5E1]",
    social: "border border-[#334155] bg-[#1E293B]",
    // The contact icons are drawn in #334155; render them light on the dark ground.
    contactIcon: "brightness-0 invert opacity-80",
    contactText: "text-[#E2E8F0]",
    divider: "bg-[#334155]",
    copyright: "text-[#94A3B8]",
    link: "text-[#60A5FA]",
    linkDivider: "bg-[#475569]",
    muted: "text-[#94A3B8]",
  },
} as const;

export default function Footer({ variant = "light" }: { variant?: keyof typeof PALETTES }) {
  const c = PALETTES[variant];
  const { data: footer, isLoading } = useFooter();

  if (isLoading) {
    return (
      <footer className={`flex items-center justify-center border-t px-4 py-8 text-sm ${c.footer} ${c.copyright}`}>
        載入頁尾資料中…
      </footer>
    );
  }

  if (!footer) {
    return (
      <footer className={`flex items-center justify-center border-t px-4 py-8 text-sm text-[#B45309] ${c.footer}`}>
        頁尾資料缺少（API 無回應）
      </footer>
    );
  }

  const socialUrls: Record<string, string | null> = {
    facebook: footer.facebook_url,
    instagram: footer.instagram_url,
    line: footer.line_url,
  };
  const activeSocialLinks = SOCIAL_LINK_DEFS.filter((social) => socialUrls[social.id]);

  const contactItems = [
    { id: "phone", icon: "/images/footer-phone-icon.svg", text: footer.phone, href: `tel:${footer.phone}` },
    { id: "address", icon: "/images/footer-location-icon.svg", text: footer.address },
    { id: "email", icon: "/images/footer-email-icon.svg", text: footer.email, href: `mailto:${footer.email}` },
  ];

  return (
    <footer className={`flex flex-col items-center gap-3 border-t px-4 py-8 sm:px-8 lg:px-[120px] ${c.footer}`}>
      <div className="flex w-full max-w-[1200px] flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className={`flex w-fit items-center gap-1 ${c.logoCard}`}>
            {footer.logo ? (
              <span className="relative h-12 w-[68px] shrink-0">
                <Image src={footer.logo} alt="" fill className="object-contain" />
              </span>
            ) : (
              <span className="flex h-12 w-[68px] shrink-0 items-center justify-center rounded bg-white/60 text-[10px] text-[#94969C]">
                無 Logo
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-serif text-lg font-bold ${c.brand}`}>{footer.brand_name_zh}</span>
            <span className={`text-lg font-semibold ${c.brand}`}>{footer.brand_name_en}</span>
          </div>
          <div className={`flex flex-col gap-2 whitespace-pre-line text-sm leading-relaxed ${c.legal}`}>
            {footer.legal_info}
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 pt-4">
          {activeSocialLinks.length > 0 ? (
            <div className="flex items-center gap-10">
              {activeSocialLinks.map((social) => (
                <a
                  key={social.id}
                  href={socialUrls[social.id] ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full ${c.social}`}
                >
                  <Image src={social.icon} alt="" width={48} height={48} />
                </a>
              ))}
            </div>
          ) : (
            <span className={`text-sm ${c.muted}`}>無社群連結</span>
          )}

          <div className="flex flex-col gap-3.5">
            {contactItems.map((item) => {
              const content = (
                <>
                  <Image src={item.icon} alt="" width={20} height={20} className={c.contactIcon} />
                  <span className={`text-sm ${c.contactText}`}>{item.text}</span>
                </>
              );
              return item.href ? (
                <a key={item.id} href={item.href} className="flex cursor-pointer items-center gap-3">
                  {content}
                </a>
              ) : (
                <div key={item.id} className="flex items-center gap-3">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`h-px w-full max-w-[1200px] ${c.divider}`} />

      <div className="flex w-full max-w-[1200px] flex-col items-center gap-4 py-4 sm:flex-row sm:justify-between">
        <span className={`text-sm ${c.copyright}`}>{footer.copyright}</span>
        <div className="flex items-center gap-5">
          {footer.links.length > 0 ? (
            footer.links.map((link, i) => (
              <span key={link.url} className="flex items-center gap-5">
                {i > 0 && <span className={`h-3.5 w-px ${c.linkDivider}`} />}
                <Link href={link.url} className={`cursor-pointer text-sm font-medium ${c.link}`}>
                  {link.label}
                </Link>
              </span>
            ))
          ) : (
            <span className={`text-sm ${c.muted}`}>無頁尾連結</span>
          )}
        </div>
      </div>
    </footer>
  );
}
