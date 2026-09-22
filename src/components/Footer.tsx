import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS = [
  { id: "facebook", icon: "/images/footer-social-1.svg", label: "Facebook" },
  { id: "instagram", icon: "/images/footer-social-2.svg", label: "Instagram" },
  { id: "line", icon: "/images/footer-social-3.svg", label: "LINE" },
];

const CONTACT_INFO = [
  { id: "phone", icon: "/images/footer-phone-icon.svg", text: "03-3373577", href: "tel:03-3373577" },
  {
    id: "address",
    icon: "/images/footer-location-icon.svg",
    text: "330 桃園市桃園區三民路三段 170 號",
  },
  { id: "email", icon: "/images/footer-email-icon.svg", text: "xxxxxxx@xxx.com", href: "mailto:xxxxxxx@xxx.com" },
];

const UTILITY_LINKS = [
  { id: "remittance", label: "匯款資訊", href: "/terms" },
  { id: "terms", label: "旅客須知及服務條款", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-3 border-t border-[#D6DEE8] bg-[#EBF4FF] px-4 py-8 sm:px-8 lg:px-[120px]">
      <div className="flex w-full max-w-[1200px] flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            <span className="relative h-12 w-[68px] shrink-0">
              <Image src="/images/logo-mark.png" alt="" fill className="object-contain" />
            </span>
            <span className="relative h-10 w-[100px] shrink-0">
              <Image src="/images/logo-text.png" alt="" fill className="object-contain" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#1A1C1E]">嘉新旅遊</span>
            <span className="text-lg font-semibold text-[#1A1C1E]">Chia Hsin Travel</span>
          </div>
          <div className="flex flex-col gap-2 text-sm leading-relaxed text-[#616E80]">
            <p>嘉新旅遊股份有限公司（甲種旅行社）</p>
            <p>代表人：姓名　｜　統一編號：XXXXXXX</p>
            <p>交觀甲 第XXXX號　｜　品保北 XXXX號</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 pt-4">
          <div className="flex items-center gap-10">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.id}
                href="#"
                aria-label={social.label}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Image src={social.icon} alt="" width={48} height={48} />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3.5">
            {CONTACT_INFO.map((item) => {
              const content = (
                <>
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="text-sm text-[#334155]">{item.text}</span>
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

      <div className="h-px w-full max-w-[1200px] bg-[#D6DEE8]" />

      <div className="flex w-full max-w-[1200px] flex-col items-center gap-4 py-4 sm:flex-row sm:justify-between">
        <span className="text-sm text-[#738091]">
          Copyright © 2024 Chia Hsin Travel. All rights reserved.
        </span>
        <div className="flex items-center gap-5">
          {UTILITY_LINKS.map((link, i) => (
            <span key={link.id} className="flex items-center gap-5">
              {i > 0 && <span className="h-3.5 w-px bg-[#C7CFD9]" />}
              <Link href={link.href} className="cursor-pointer text-sm font-medium text-[#0053E0]">
                {link.label}
              </Link>
            </span>
          ))}
          <span className="h-3.5 w-px bg-[#C7CFD9]" />
          <span className="text-sm text-[#738091]">Designed by Brenda</span>
        </div>
      </div>
    </footer>
  );
}
