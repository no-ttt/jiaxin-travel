import Image from "next/image";

type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bg: string;
  accent: string;
  icon: string;
  softAccent: string;
};

const FEATURES: Feature[] = [
  {
    id: "freedom",
    eyebrow: "FREEDOM",
    title: "無購物行程",
    description: "不合車、不併團，也不安排購物站，保留更多自在探索的時間",
    bg: "#E0EEFA",
    accent: "rgba(33, 122, 229, 0.56)",
    icon: "/images/feature-icon-freedom.svg",
    softAccent: "/images/feature-card-soft-accent-freedom.svg",
  },
  {
    id: "flexible",
    eyebrow: "FLEXIBLE",
    title: "彈性成行",
    description: "依團體人數與需求安排，不受一般團體最低人數限制",
    bg: "#DEF2EA",
    accent: "rgba(51, 148, 122, 0.56)",
    icon: "/images/feature-icon-flexible.svg",
    softAccent: "/images/feature-card-soft-accent-flexible.svg",
  },
  {
    id: "personal-care",
    eyebrow: "PERSONAL CARE",
    title: "專人服務",
    description: "依同行成員與旅行情境調整節奏，旅途中也有專人協助",
    bg: "#FAE9D8",
    accent: "rgba(232, 128, 77, 0.56)",
    icon: "/images/feature-icon-personal-care.svg",
    softAccent: "/images/feature-card-soft-accent-personal-care.svg",
  },
  {
    id: "tailored",
    eyebrow: "TAILORED",
    title: "客製旅程",
    description: "住宿、餐食、交通與體驗皆可依預算和偏好彈性安排",
    bg: "#DAE3F9",
    accent: "rgba(89, 107, 217, 0.56)",
    icon: "/images/feature-icon-tailored.svg",
    softAccent: "/images/feature-card-soft-accent-tailored.svg",
  },
  {
    id: "consultation",
    eyebrow: "CONSULTATION",
    title: "免費諮詢",
    description: "由顧問協助整理預算與需求，提供初步規劃方向",
    bg: "#F2E3FD",
    accent: "rgba(156, 99, 199, 0.56)",
    icon: "/images/feature-icon-consultation.svg",
    softAccent: "/images/feature-card-soft-accent-consultation.svg",
  },
];

const TOP_ROW_FEATURES = FEATURES.slice(0, 3);
const BOTTOM_ROW_FEATURES = FEATURES.slice(3);

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div
      className="flex w-[320px] shrink-0 flex-col gap-4 rounded-[48px_8px_48px_8px] px-6 py-8 shadow-[0px_9px_22px_0px_rgba(5,26,56,0.08)]"
      style={{ backgroundColor: feature.bg }}
    >
      <div className="flex items-center justify-between">
        <Image src={feature.softAccent} alt="" width={56} height={28} />
        <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[18px] bg-white shadow-[0px_4px_10px_0px_rgba(5,26,56,0.07)]">
          <Image src={feature.icon} alt="" width={24} height={24} />
        </div>
      </div>
      <div className="flex gap-3">
        <span className="h-12 w-[3px] shrink-0 rounded-sm" style={{ backgroundColor: feature.accent }} />
        <div className="flex flex-col gap-2">
          <span
            className="text-[10px] font-semibold tracking-[0.16em]"
            style={{ color: feature.accent }}
          >
            {feature.eyebrow}
          </span>
          <h3 className="text-lg font-bold text-[#090909] sm:text-[19px]">{feature.title}</h3>
          <p className="text-[13px] leading-[1.58] text-[#535F71]">{feature.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function FeatureCards() {
  return (
    <section className="flex flex-col items-center gap-16 px-4 pb-10 pt-0 -mt-40 sm:px-8 lg:px-[120px] lg:pb-10 lg:pt-0">
      <div className="flex max-w-[760px] flex-col items-center gap-2 text-center">
        <span className="text-xs font-semibold tracking-[0.1833em] text-[#0053E0]">
          WHY TRAVEL WITH US
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#090909] sm:text-[32px]">
          客製包團五大優勢
        </h2>
        <p className="text-sm leading-[1.6] text-[#535F71]">
          從行程自由度到旅途中需要的協助，依照這一團人的節奏與期待，逐步整理成適合的旅行方式。
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-8">
          {TOP_ROW_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
        <div className="-mt-4 flex flex-wrap justify-center gap-8">
          {BOTTOM_ROW_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
