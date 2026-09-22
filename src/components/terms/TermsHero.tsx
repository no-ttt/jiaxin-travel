import Image from "next/image";

export default function TermsHero() {
  return (
    <section className="relative flex h-[220px] items-end overflow-hidden px-4 pb-8 sm:h-[280px] sm:px-8 sm:pb-10 lg:h-[320px] lg:px-[120px] lg:pb-20">
      <Image
        src="/images/terms-hero-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5, 14, 28, 0.82) 0%, rgba(5, 14, 28, 0.46) 58%, rgba(5, 14, 28, 0.16) 100%)",
        }}
      />
      <div className="relative flex w-full max-w-[800px] flex-col gap-2 sm:gap-4">
        <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-[48px] lg:leading-[64px]">
          旅客須知及服務條款
        </h1>
        <p className="max-w-[620px] text-sm text-white/90 sm:text-base lg:text-[17px] lg:leading-[30px]">
          專業快速，出發前先了解重要資訊，讓每段旅程都能安心、順利地開始。
        </p>
      </div>
    </section>
  );
}
