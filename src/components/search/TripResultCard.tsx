import Image from "next/image";
import Link from "next/link";

export type TripResult = {
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  durationDays: number;
  season: "春季（3–5 月）" | "夏季（6–8 月）" | "秋季（9–11 月）" | "冬季（12–2 月）";
};

export default function TripResultCard({ trip }: { trip: TripResult }) {
  return (
    <div className="flex overflow-hidden rounded-2xl bg-white shadow-[0px_10px_28px_0px_rgba(8,28,58,0.07)]">
      <div className="relative h-64 w-[360px] shrink-0">
        <Image src={trip.image} alt={trip.title} fill sizes="360px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-8 p-6">
        <div className="flex flex-1 flex-col gap-3">
          <h3 className="text-xl font-medium text-[#1A1C1E]">{trip.title}</h3>
          <p className="text-sm leading-relaxed text-[#5B6574]">{trip.description}</p>
        </div>
        <div className="flex items-center justify-between border-t border-[#C3C6D6] pt-3">
          <div className="flex items-end gap-1">
            <span className="text-[13px] text-[#002366]">TWD </span>
            <span className="text-[25px] font-semibold leading-8 text-[#0053E0]">{trip.price}</span>
            <span className="text-[13px] text-[#002366]">元起</span>
          </div>
          <Link
            href={`/search/${trip.id}`}
            className="flex cursor-pointer items-center gap-1 text-[13px] font-medium text-[#002366]"
          >
            查看行程
            <Image src="/images/detail-arrow-icon.svg" alt="" width={5} height={8} />
          </Link>
        </div>
      </div>
    </div>
  );
}
