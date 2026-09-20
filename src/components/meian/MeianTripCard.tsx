import Image from "next/image";
import Link from "next/link";
import type { MeianTrip } from "./data";

export default function MeianTripCard({ trip }: { trip: MeianTrip }) {
  return (
    <div className="flex w-full max-w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_10px_28px_0px_rgba(8,28,58,0.07)]">
      <div className="relative h-64 w-full shrink-0">
        <Image src={trip.image} alt={trip.title} fill sizes="360px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 py-5">
        <h3 className="text-lg font-medium leading-6 text-[#1A1C1E]">{trip.title}</h3>
        <p className="text-sm leading-[1.6] text-[#5B6574]">{trip.description}</p>
      </div>
      <div className="flex items-center justify-between border-t border-[#C3C6D6] px-6 pb-5 pt-3">
        <div className="flex items-end gap-1">
          <span className="text-[13px] text-[#002366]">TWD </span>
          <span className="text-[25px] font-semibold leading-8 text-[#0053E0]">{trip.price}</span>
          <span className="text-[13px] text-[#002366]">元起</span>
        </div>
        <Link
          href={`/search/${trip.id}`}
          className="flex cursor-pointer items-center gap-1 text-[13px] font-medium text-[#002366]"
        >
          詳情
          <Image src="/images/detail-arrow-icon.svg" alt="" width={5} height={8} />
        </Link>
      </div>
    </div>
  );
}
