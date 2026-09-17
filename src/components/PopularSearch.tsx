import Image from "next/image";

const HIT_ROWS = [
  ["日本", "韓國", "泰國", "馬來西亞"],
  ["六個字的地方", "美國", "香港澳門", "新加坡"],
  ["杜拜", "韓國", "泰國", "馬來西亞"],
];

export default function PopularSearch() {
  return (
    <div className="flex items-stretch gap-6 overflow-hidden rounded-3xl bg-white pl-8 shadow-[4px_4px_40px_0px_rgba(24,72,150,0.15)]">
      <div className="flex w-full max-w-[652px] flex-col gap-5 py-6">
        <div className="flex items-center gap-2">
          <Image src="/images/bolt-icon.svg" alt="" width={24} height={24} />
          <h2 className="text-lg font-medium uppercase text-black">熱門快搜</h2>
        </div>

        <div className="flex flex-col gap-6">
          {HIT_ROWS.map((row, i) => (
            <div key={i} className="flex flex-wrap items-center gap-6">
              {row.map((label, j) => (
                <button
                  key={`${label}-${i}-${j}`}
                  type="button"
                  className="cursor-pointer whitespace-nowrap rounded-2xl px-3 py-1 text-base uppercase text-black transition hover:bg-slate-100"
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative hidden min-h-[260px] flex-1 sm:block">
        <Image
          src="/images/popular-search.png"
          alt=""
          fill
          sizes="(min-width: 640px) 40vw, 0px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
