import Image from "next/image";

export default function VisaHero() {
  return (
    <section className="relative flex h-[220px] items-end overflow-hidden px-4 pb-8 sm:h-[280px] sm:px-8 sm:pb-10 lg:h-[360px] lg:px-[120px] lg:pb-20">
      <Image
        src="/images/visa-hero-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-top"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(226, 226, 226, 0.4) 100%)",
        }}
      />
      <div className="relative flex w-full max-w-[800px] flex-col gap-2 sm:gap-4">
        <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-[48px] lg:leading-[64px]">
          護照及簽證代辦服務
        </h1>
        <p className="max-w-[620px] text-sm text-white/90 sm:text-base lg:text-[17px] lg:leading-[30px]">
          先查天數與費用，備妥文件後直接聯繫專員辦理。
        </p>
      </div>
    </section>
  );
}
