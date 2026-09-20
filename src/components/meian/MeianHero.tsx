export default function MeianHero() {
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

      <div className="relative flex flex-col gap-4">
        <h1 className="font-serif text-3xl font-bold text-[#090909] sm:text-[48px]">美安專區</h1>
        <p className="text-sm text-[#A29DB0] sm:text-base">美安會員專屬精選旅遊</p>
      </div>
    </div>
  );
}
