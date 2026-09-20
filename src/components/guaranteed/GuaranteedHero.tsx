import Image from "next/image";

export default function GuaranteedHero() {
  return (
    <div className="flex flex-col items-start gap-6 rounded-3xl bg-[#FAFAFA] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
      <div className="flex max-w-[600px] flex-col gap-3.5">
        <span className="text-sm font-semibold uppercase tracking-[0.0857em] text-[#0053E0]">
          GUARANTEED DEPARTURE ／ 保證出團
        </span>
        <h1 className="font-serif text-3xl font-bold leading-[1.3] tracking-[-0.005em] text-[#090909] sm:text-[40px]">
          保證出團
        </h1>
        <p className="text-[15px] leading-[1.75] text-[#535F71] sm:text-base">
          出發日期已確認，少一點等待，多一點期待。精選可安心安排假期的行程。
        </p>
        <div className="flex h-[34px] w-fit items-center justify-center rounded-full bg-[#ECF1FA] px-4">
          <span className="text-[13px] font-medium text-[#002366]">日期確認 × 安心出發</span>
        </div>
      </div>
      <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[320px] sm:w-[500px]">
        <Image
          src="/images/guaranteed-hero.png"
          alt=""
          fill
          sizes="500px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
