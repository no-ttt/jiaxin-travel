const PROOF_ITEMS = [
  { label: "已陪同 3,500+ 位旅客圓夢" },
  { label: "累積 500+ 趟出團合照" },
];

export default function JourneyShareHero() {
  return (
    <section className="flex flex-col items-center gap-5 bg-[#FAFAFA] px-4 pb-5 pt-12 sm:px-8 sm:pt-14 lg:px-[120px] lg:pt-[56px]">
      <div className="flex max-w-[900px] flex-col items-center gap-[10px] text-center">
        <span className="text-xs font-semibold tracking-[0.1833em] text-[#0053E0]">
          JOURNEY STORIES
        </span>
        <h1 className="font-serif text-4xl font-bold text-[#090909] sm:text-[48px]">旅程分享</h1>
        <p className="text-base leading-[1.65] text-[#535F71]">
          那些一起出發、一起笑過的瞬間，才是旅程最值得留下的風景。
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-[10px]">
        {PROOF_ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex h-[42px] items-center gap-2 rounded-full border border-[#E0E3E8] bg-white px-4"
          >
            <span className="text-[13px] font-medium text-[#0053E0]">＃</span>
            <span className="text-[13px] font-medium text-[#090909]">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
