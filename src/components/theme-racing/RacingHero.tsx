export default function RacingHero() {
  return (
    <div
      className="relative flex flex-col items-start gap-8 overflow-hidden border-b border-[#292433] bg-cover bg-center px-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-[100px] sm:py-[60px]"
      style={{ backgroundImage: "url(/images/racing/hero-bg.png)" }}
    >
      <div className="absolute inset-0 bg-[#14111A]/70" />

      <div className="relative flex max-w-[720px] flex-col gap-4">
        <span className="text-[13px] font-bold tracking-[0.1538em] text-[#14D7B6]">
          主題旅遊　/　賽事系列
        </span>
        <h1 className="font-serif text-4xl font-black leading-tight text-white sm:text-[48px] sm:leading-[56px]">
          極限賽道・狂飆之旅
        </h1>
        <p className="text-sm leading-[1.6] text-[#A29DB0] sm:text-base sm:leading-[26px]">
          直擊世界級 F1 與 MotoGP 賽事，感受引擎轟鳴與輪胎摩擦的極限熱血。我們將速度、激情與奢華探索安排進同一段深度旅程。
        </p>
      </div>

      <div className="relative flex h-12 w-[184px] shrink-0 items-center justify-center rounded-xl bg-[#FF5C00]">
        <span className="text-[13px] font-medium leading-[1.4em] text-white">
          精選賽事 × 深度旅行
        </span>
      </div>
    </div>
  );
}
