import Image from "next/image";

type NextArticleCardProps = {
  label: string;
  onClick: () => void;
};

export default function NextArticleCard({ label, onClick }: NextArticleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[140px] w-full shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-5 py-4 text-left shadow-[0px_6px_16px_0px_rgba(0,0,0,0.05)] hover:bg-white sm:w-[320px]"
    >
      <div className="flex flex-1 flex-col items-stretch gap-1.5">
        <span className="text-[10px] font-semibold tracking-[0.2em] text-[#535F71]">
          NEXT ARTICLE
        </span>
        <span className="text-xs font-medium text-[#535F71]">下一篇</span>
        <span className="text-base font-medium text-[#002366]">{label}</span>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
        <Image src="/images/arrow-right-icon.svg" alt="" width={24} height={24} />
      </span>
    </button>
  );
}
