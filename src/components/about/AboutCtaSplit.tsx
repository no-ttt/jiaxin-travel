import Image from "next/image";
import Link from "next/link";

export default function AboutCtaSplit() {
  return (
    <section className="flex flex-col sm:flex-row">
      <Link
        href="/search"
        className="group relative flex h-[320px] flex-1 flex-col justify-center gap-4 overflow-hidden px-6 py-10 sm:h-[430px] sm:px-[92px]"
      >
        <Image
          src="/images/about-cta-journeys-bg.png"
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#030A17]/52" />

        <div className="relative flex max-w-[480px] flex-col gap-4">
          <span className="text-xs font-semibold tracking-[0.1833em] text-[#B8D6FF]">
            CURATED JOURNEYS
          </span>
          <h3 className="font-serif text-2xl font-bold leading-[1.5] text-white sm:text-[32px]">
            探索最新精緻行程
          </h3>
          <p className="text-[15px] leading-[1.6] text-[#EBF2FF]">
            從精選路線開始，找到與期待相近的旅程。
          </p>
          <span className="text-[15px] font-medium leading-[1.45] text-white">
            查看行程&nbsp;&nbsp;→
          </span>
        </div>
      </Link>

      <Link
        href="/custom-trip"
        className="relative flex h-[320px] flex-1 flex-col justify-center gap-4 overflow-hidden px-6 py-10 sm:h-[430px] sm:px-[92px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(246, 246, 246, 1) 0%, rgba(252, 240, 224, 1) 100%)",
        }}
      >
        <div className="absolute -right-16 -top-24 h-[420px] w-[420px] rounded-full bg-white/36 blur-[22px]" />

        <div className="relative flex max-w-[490px] flex-col gap-4">
          <span className="text-xs font-semibold tracking-[0.1833em] text-[#0053E0]">
            TAILORED FOR YOUR GROUP
          </span>
          <h3 className="font-serif text-2xl font-bold leading-[1.5] text-[#090909] sm:text-[32px]">
            量身客製專屬包團
          </h3>
          <p className="max-w-[470px] text-[15px] leading-[1.6] text-[#535F71]">
            告訴我們同行的人與期待，讓顧問陪您從零開始規劃。
          </p>
          <span className="text-[15px] font-medium leading-[1.45] text-[#002366]">
            開始客製需求&nbsp;&nbsp;→
          </span>
        </div>
      </Link>
    </section>
  );
}
