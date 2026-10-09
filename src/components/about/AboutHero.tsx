import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA]">
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-10 py-12 sm:py-16 lg:min-h-[760px] lg:flex-row lg:gap-0 lg:py-0">
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#E0EDFF]/55 blur-[55px] sm:-left-32 sm:h-80 sm:w-80 lg:h-[560px] lg:w-[560px] lg:-left-[180px] lg:top-[120px]" />
        <div className="relative z-10 flex flex-col gap-5 px-4 sm:px-8 lg:flex-1 lg:pb-[100px] lg:pl-16 lg:pr-10 lg:pt-[120px] lg:[&>*]:max-w-[565px] xl:pl-[120px]">
          <span className="text-xs font-semibold tracking-[0.1846em] text-[#0053E0] sm:text-[13px]">
            嘉新旅行社 Chia Hsin Travel
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#090909] sm:text-4xl lg:text-[48px] lg:leading-[1.5]">
            品牌故事與初心
          </h1>

          <div className="flex flex-col gap-5 lg:gap-6">
            <p className="text-base leading-[1.75] text-[#535F71] lg:text-[17px]">
              深耕旅遊產業 30 年，我們用豐富的在地經驗與扎實的專業，為每位旅客把關旅程中的所有細節。
            </p>
            <p className="text-base leading-[1.75] text-[#535F71] lg:text-[17px]">
              我們相信，一段真正優質的旅程，除了豐富的內容，更來自有溫度的細緻服務。從初期客製規劃到出發後的全程守護，團隊始終以嚴謹、負責的態度，提供即時且到位的協助。
            </p>
            <p className="text-base leading-[1.75] text-[#535F71] lg:text-[17px]">
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

        <div className="relative flex flex-col lg:h-[659px] lg:w-[45.5%] lg:shrink-0">
          <div className="relative mx-4 aspect-[655/659] overflow-hidden rounded-3xl sm:mx-8 lg:absolute lg:inset-0 lg:mx-0 lg:aspect-auto lg:rounded-none">
            <Image
              src="/images/about-hero.png"
              alt="嘉新旅遊帶領旅客探索世界"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          <div className="relative mx-4 -mt-6 flex flex-col gap-3 rounded-3xl bg-white px-7 py-6 shadow-[0px_16px_36px_0px_rgba(5,15,31,0.14)] backdrop-blur-sm sm:mx-8 sm:w-[420px] lg:absolute lg:-left-[72px] lg:top-[512px] lg:mx-0 lg:mt-0 lg:h-[188px] lg:w-[420px]">
            <span className="font-serif text-[34px] font-bold leading-none text-[#0053E0]">“</span>
            <p className="font-serif text-xl font-bold leading-[1.55] text-[#090909] sm:text-[22px]">
              旅行不是行程的排列，
              <br />
              而是一路都有人替您多想一步。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
