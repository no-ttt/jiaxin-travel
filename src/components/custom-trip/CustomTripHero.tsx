import Image from "next/image";

export default function CustomTripHero({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="relative isolate">
      <Image
        src="/images/custom-trip-hero-blobs.svg"
        alt=""
        width={1440}
        height={650}
        // Phones／tablets: a background behind the text; from lg the text sits over the full image.
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover lg:static lg:z-auto lg:block lg:h-auto"
        priority
      />

      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-6 px-4 pb-16 pt-12 text-center lg:absolute lg:left-1/2 lg:top-1/3 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:gap-8 lg:p-0 lg:px-4">
        <h1 className="font-serif text-3xl font-bold leading-[1.45] text-[#090909] sm:text-[44px]">
          規劃一趟專屬您的旅程
        </h1>
        <p className="max-w-[760px] text-sm leading-[1.65] text-[#535F71] sm:text-base sm:text-[17px]">
          適合家庭、朋友聚會、企業包團與小型私人旅程，由專屬顧問依照成員、預算與期待進行規劃。
        </p>
        <button
          type="button"
          onClick={onCtaClick}
          className="flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#0053E0] px-8 text-lg font-bold text-white shadow-[0px_9px_22px_0px_rgba(5,26,56,0.08)] transition hover:bg-[#0044b8]"
        >
          立即填寫需求單
          <Image src="/images/custom-trip-cta-arrow.svg" alt="" width={24} height={24} />
        </button>
      </div>
    </section>
  );
}
