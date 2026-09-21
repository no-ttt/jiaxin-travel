import Image from "next/image";

const PILLARS = [
  {
    label: "傾聽",
    metric: "1 對 1",
    metricLabel: "專屬顧問",
    description:
      "專屬行程規劃諮詢，為你與家人量身雕琢旅行細節。先理解同行成員、旅遊目的與不能妥協的細節，再依需求規劃。",
    icon: "/images/about-icon-listen.svg",
  },
  {
    label: "安排",
    metric: "30+ 年",
    metricLabel: "旅遊經驗",
    description:
      "以長期累積的經驗，把住宿、交通、餐食與節奏放進同一張藍圖，讓每個選擇彼此照應。",
    icon: "/images/about-icon-plan.svg",
  },
  {
    label: "守護",
    metric: "60,000+ 位",
    metricLabel: "旅人見證",
    description:
      "從出發到回程保持聯繫，在突發狀況與需要決定的時刻提供到位協助，讓嚮往安心成為回憶。",
    icon: "/images/about-icon-protect.svg",
  },
];

export default function CorePillars() {
  return (
    <section className="flex flex-col items-center gap-10 bg-[#FAFAFA] px-4 py-14 sm:px-8 sm:py-16 lg:gap-12 lg:px-[120px] lg:py-[88px]">
      <div className="flex w-full max-w-[1200px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <h2 className="font-serif text-3xl font-bold text-[#090909] sm:text-4xl lg:text-[38px]">
          我們的三大核心
        </h2>
        <p className="text-sm font-medium text-[#535F71] sm:text-base">
          用時間累積經驗，用服務累積信任。
        </p>
      </div>

      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.label}
            className="relative flex flex-col gap-3.5 overflow-hidden rounded-3xl border border-[#E0E3E8] bg-white p-8 shadow-[0px_10px_26px_0px_rgba(0,35,102,0.07)]"
          >
            <div className="absolute -right-3 -top-3 flex h-[113px] w-[113px] items-center justify-center rounded-full bg-[#F0F6FF]">
              <Image src={pillar.icon} alt="" width={44} height={44} />
            </div>

            <div className="relative flex flex-col gap-3.5">
              <h3 className="font-serif text-base font-bold leading-[1.45] text-[#090909]">
                {pillar.label}
              </h3>
              <div className="flex flex-col gap-0.5">
                <span className="text-[32px] font-semibold leading-[1.25] tracking-[-0.0063em] text-[#0053E0]">
                  {pillar.metric}
                </span>
                <span className="text-lg font-medium leading-[1.35] tracking-[0.0111em] text-[#535F71]">
                  {pillar.metricLabel}
                </span>
              </div>
            </div>

            <div className="relative flex flex-col gap-4">
              <span className="h-0.5 w-20 bg-[#0053E0]" />
              <p className="text-[15px] leading-[1.65] text-[#535F71]">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
