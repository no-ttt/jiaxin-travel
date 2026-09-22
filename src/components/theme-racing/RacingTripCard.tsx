import Image from "next/image";
import Link from "next/link";
import type { RacingTrip } from "./data";

export default function RacingTripCard({ trip }: { trip: RacingTrip }) {
  return (
    <Link
      href={`/search/${trip.id}`}
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-[#14111A] shadow-[0px_10px_28px_0px_rgba(8,28,58,0.07)]"
    >
      <div className="relative h-64 w-full shrink-0">
        <Image src={trip.image} alt={trip.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 py-5">
        <h3 className="text-lg font-medium leading-6 text-white">{trip.title}</h3>
        <p className="text-sm leading-[1.6] text-[#A29DB0]">{trip.description}</p>
      </div>
      <div className="flex items-center justify-between border-t border-[#292433] px-6 pb-5 pt-3">
        <div className="flex items-end gap-1">
          <span className="text-[13px] text-[#14D7B6]">TWD </span>
          <span className="text-[25px] font-semibold leading-8 text-white">{trip.price}</span>
          <span className="text-[13px] text-[#14D7B6]">元起</span>
        </div>
      </div>
    </Link>
  );
}
