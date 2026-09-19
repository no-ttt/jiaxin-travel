import Image from "next/image";

export default function OtherCountriesCta() {
  return (
    <div
      className="flex w-full flex-col items-start gap-6 rounded-[22px] px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-[30px]"
      style={{
        background:
          "linear-gradient(90deg, rgba(235, 245, 255, 1) 0%, rgba(251, 246, 235, 1) 100%)",
      }}
    >
      <div className="flex max-w-[760px] flex-col gap-2.5">
        <h3 className="font-serif text-xl font-bold text-[#090909] sm:text-[23px]">
          需要其他國家簽證或特殊證件代辦？
        </h3>
        <p className="text-sm leading-[1.65] text-[#535F71]">
          我們亦提供歐洲、非洲、中南美洲等全球多國簽證諮詢與代辦服務。由專員依您的目的地、身分與出發日期確認最新規範與報價。
        </p>
      </div>
      <a
        href="#"
        className="flex h-[52px] w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#0053E0] px-6 text-sm font-bold text-white hover:bg-[#0047c2] sm:w-[260px]"
      >
        <Image src="/images/visa-chat-icon.svg" alt="" width={20} height={20} />
        線上專人諮詢
      </a>
    </div>
  );
}
