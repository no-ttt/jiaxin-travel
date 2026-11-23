import type { PublicCollection } from "@/lib/api/types/collection";

/** Title / subtitle come from the 美安專區 collection (後台文案); the design copy is the fallback. */
export default function MeianHero({ collection }: { collection: PublicCollection | null }) {
  const title = collection?.title || "美安專區";
  const subtitle = collection?.subtitle || "美安會員專屬精選旅遊";

  return (
    <div className="relative flex items-center overflow-hidden bg-[#E8F2FF] px-6 py-10 sm:px-20 sm:py-0 sm:h-[180px]">
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src="/images/meian-accent-gray.svg"
        alt=""
        className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[620px] sm:block"
      />
      <img
        src="/images/meian-accent-teal.svg"
        alt=""
        className="pointer-events-none absolute inset-y-0 right-[150px] hidden h-full w-[470px] sm:block"
      />
      <img
        src="/images/meian-accent-navy.svg"
        alt=""
        className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[475px] sm:block"
      />
      {/* eslint-enable @next/next/no-img-element */}

      {/* Text stays inside the 1440 design's content width (80px gutters), centered on wide screens. */}
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-4">
        <h1 className="font-serif text-3xl font-bold text-[#090909] sm:text-[48px]">{title}</h1>
        <p className="text-sm text-[#A29DB0] sm:text-base">{subtitle}</p>
      </div>
    </div>
  );
}
