import Image from "next/image";

type Standard = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

const STANDARDS: Standard[] = [
  {
    id: "custom",
    icon: "/images/standard-custom-icon.svg",
    title: "專屬客製",
    description: "專屬顧問 1 對 1 量身打造，無論家族聚會或企業包團，彈性滿足您的多元需求。",
  },
  {
    id: "theme",
    icon: "/images/standard-theme-icon.svg",
    title: "嚴選特色主題",
    description: "精選文化、美食與深度私房特色路線，跳脫傳統走馬看花，帶您玩出不一樣的主題體驗。",
  },
  {
    id: "support",
    icon: "/images/standard-support-icon.svg",
    title: "全程即時支援",
    description: "旅程中隨時有專人為您排憂解難，突發狀況即時回應，讓您出遊全程踏實又安心。",
  },
];

function StandardCard({ standard }: { standard: Standard }) {
  return (
    <div className="flex flex-1 flex-col items-stretch rounded-[20px] border border-[#E0E3E8] bg-white px-6 py-8 shadow-[0px_6px_20px_0px_rgba(0,35,102,0.06)]">
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#DBE8FF]">
          <Image src={standard.icon} alt="" width={24} height={24} />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-medium text-[#090909]">{standard.title}</h3>
          <p className="text-base leading-relaxed text-[#535F71]">{standard.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function OurStandards() {
  return (
    <section className="bg-[#F3F3F6] px-4 py-12 sm:px-8 lg:px-[120px]">
      <div className="flex flex-col items-stretch gap-16">
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-serif text-3xl font-bold text-[#1A1C1E] sm:text-[32px]">
            嘉新旅遊的堅持
          </h2>
          <div className="h-1 w-12 rounded-[20px] bg-[#0053E0]" />
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
          {STANDARDS.map((standard) => (
            <StandardCard key={standard.id} standard={standard} />
          ))}
        </div>
      </div>
    </section>
  );
}
