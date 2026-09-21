import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] lg:h-[760px]">
      <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#E0EDFF]/55 blur-[55px] sm:-left-32 sm:h-80 sm:w-80 lg:h-[560px] lg:w-[560px] lg:-left-[180px] lg:top-[120px]" />

      <div className="relative flex flex-col gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:block lg:h-full lg:px-0 lg:py-0">
        <div className="relative z-10 flex flex-col gap-5 lg:absolute lg:left-[120px] lg:top-[120px] lg:w-[565px]">
          <span className="text-xs font-semibold tracking-[0.1846em] text-[#0053E0] sm:text-[13px]">
            嘉新旅行社 Chia Hsin Travel
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#090909] sm:text-4xl lg:text-[48px] lg:leading-[1.5]">
            品牌故事與初心
          </h1>

          <div className="flex flex-col gap-5">
            <p className="text-base leading-[1.75] text-[#535F71]">
              深耕旅遊產業 30 年，我們用豐富的在地經驗與扎實的專業，為每位旅客把關旅程中的所有細節。
            </p>
            <p className="text-base leading-[1.75] text-[#535F71]">
              我們相信，一段真正優質的旅程，除了豐富的內容，更來自有溫度的細緻服務。從初期客製規劃到出發後的全程守護，團隊始終以嚴謹、負責的態度，提供即時且到位的協助。
            </p>
            <p className="text-base leading-[1.75] text-[#535F71]">
              始終堅持以「讓旅客安心」為核心。不論是家庭出遊還是專屬組團，我們都致力於用最沉穩的經驗擋下所有繁雜瑣事，讓您與家人享受最踏實、安全的旅行體驗。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px w-11 bg-[#0053E0]" />
            <p className="text-sm font-medium text-[#002366]">
              30 年，把複雜留給我們，把從容留給旅人。
            </p>
          </div>
        </div>

        <div className="relative mx-4 aspect-[655/659] overflow-hidden rounded-3xl sm:mx-8 lg:absolute lg:right-0 lg:top-0 lg:mx-0 lg:aspect-auto lg:h-[659px] lg:w-[655px] lg:rounded-none">
          <Image
            src="/images/about-hero.png"
            alt="嘉新旅遊帶領旅客探索世界"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="relative mx-4 -mt-6 flex flex-col justify-center gap-3 rounded-3xl bg-white px-7 py-6 shadow-[0px_16px_36px_0px_rgba(5,15,31,0.14)] backdrop-blur-sm sm:mx-8 sm:w-[420px] lg:absolute lg:left-[713px] lg:top-[512px] lg:mx-0 lg:mt-0 lg:h-[188px] lg:w-[420px]">
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" className="text-[#0053E0]">
            <path
              d="M0 18V10.667C0 4.267 4 0.4 10.667 0L11.333 2.667C7.333 3.733 5.333 6 5.333 9.333H10.667V18H0ZM13.333 18V10.667C13.333 4.267 17.333 0.4 24 0L24.667 2.667C20.667 3.733 18.667 6 18.667 9.333H24V18H13.333Z"
              fill="currentColor"
            />
          </svg>
          <p className="font-serif text-xl font-bold leading-[1.55] text-[#090909] sm:text-[22px]">
            旅行不是行程的排列，
            <br />
            而是一路都有人替您多想一步。
          </p>
        </div>
      </div>
    </section>
  );
}
